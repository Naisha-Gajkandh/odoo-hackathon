import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { maintenanceService } from '../services/maintenanceService';
import MaintenanceCard from '../components/MaintenanceCard';
import { VehicleStatusCard, EstimatedCompletionCard } from '../components/MaintenanceStats';
import MaintenanceForm from '../components/MaintenanceForm';
import MaintenanceTable from '../components/MaintenanceTable';
import MaintenanceModal from '../components/MaintenanceModal';
import MaintenanceSkeleton from '../components/MaintenanceSkeleton';

const Maintenance = ({ searchQuery }) => {
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, IN SHOP, SCHEDULED
  const [activeTab, setActiveTab] = useState('Summary'); // Summary, Costs & Billing, Photos & Records, Schedule
  const [showTechnicianDropdown, setShowTechnicianDropdown] = useState(false);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const technicians = [
    "Marcus Vance",
    "Sarah Jenkins",
    "John Smith",
    "Emily Davis",
    "David Miller"
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsData, historyData] = await Promise.all([
        maintenanceService.getActiveLogs(),
        maintenanceService.getHistory()
      ]);
      setLogs(logsData);
      setHistory(historyData);
      
      // Auto-select the first log if available
      if (logsData.length > 0) {
        setSelectedLog(logsData[0]);
      } else {
        setSelectedLog(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load maintenance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logs based on search query and status filter
  const filteredLogs = logs.filter(log => {
    // 1. Status Filter
    if (statusFilter !== 'ALL') {
      if (log.status?.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }
    }

    // 2. Search query filter (matches vehicle ID, service type, or vehicle type)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const idMatch = log.vehicleId?.toLowerCase().includes(q);
      const serviceMatch = log.serviceType?.toLowerCase().includes(q);
      const typeMatch = log.vehicleType?.toLowerCase().includes(q);
      return idMatch || serviceMatch || typeMatch;
    }

    return true;
  });

  // Handle active log selection
  const handleSelectLog = (log) => {
    setSelectedLog(log);
    setShowTechnicianDropdown(false);
  };

  // Handle creating a new active log record
  const handleCreateRecord = async (newRecordData) => {
    try {
      const newLog = await maintenanceService.createActiveLog(newRecordData);
      toast.success(`Maintenance Record for ${newLog.vehicleId} logged!`);
      
      // Refresh data
      const updatedLogs = await maintenanceService.getActiveLogs();
      setLogs(updatedLogs);
      // Select the newly created log
      const createdLog = updatedLogs.find(l => l.id === newLog.id);
      if (createdLog) {
        setSelectedLog(createdLog);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to log maintenance record.');
    }
  };

  // Handle adjusting schedule (progress % / target completion)
  const handleAdjustSchedule = async (adjustedData) => {
    if (!selectedLog) return;
    try {
      const updatedLog = await maintenanceService.updateActiveLog(selectedLog.id, adjustedData);
      toast.success('Maintenance schedule updated successfully.');
      setSelectedLog(updatedLog);
      
      // Refresh list
      const updatedLogs = await maintenanceService.getActiveLogs();
      setLogs(updatedLogs);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update schedule.');
    }
  };

  // Handle technician assignment
  const handleAssignTechnician = async (techName) => {
    if (!selectedLog) return;
    try {
      const updatedLog = await maintenanceService.updateActiveLog(selectedLog.id, {
        assignedTechnician: techName
      });
      toast.success(techName ? `Assigned to ${techName}` : 'Technician unassigned.');
      setSelectedLog(updatedLog);
      setShowTechnicianDropdown(false);

      // Refresh list
      const updatedLogs = await maintenanceService.getActiveLogs();
      setLogs(updatedLogs);
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign technician.');
    }
  };

  // Handle closing a record (completing it)
  const handleCloseRecord = async () => {
    if (!selectedLog) return;
    if (!window.confirm(`Are you sure you want to close maintenance record for ${selectedLog.vehicleId}?`)) return;

    try {
      const result = await maintenanceService.closeActiveLog(selectedLog.id);
      if (result) {
        toast.success(`Record for ${selectedLog.vehicleId} closed. Total Cost: $${result.historyItem.cost}`);
        
        // Refresh logs and history
        const [updatedLogs, updatedHistory] = await Promise.all([
          maintenanceService.getActiveLogs(),
          maintenanceService.getHistory()
        ]);
        setLogs(updatedLogs);
        setHistory(updatedHistory);

        // Auto-select first active log
        if (updatedLogs.length > 0) {
          setSelectedLog(updatedLogs[0]);
        } else {
          setSelectedLog(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to close record.');
    }
  };

  // Log Service Record form submission handler (adds straight to history list)
  const handleFormSubmit = async (formData) => {
    try {
      const newHistoryItem = await maintenanceService.createHistoryItem(formData);
      toast.success(`Logged service details for ${newHistoryItem.vehicleId}.`);
      
      // Refresh history list
      const updatedHistory = await maintenanceService.getHistory();
      setHistory(updatedHistory);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save service record.');
    }
  };

  // Helper count methods for status filter buttons
  const countInShop = logs.filter(l => l.status?.toUpperCase() === 'IN SHOP').length;
  const countScheduled = logs.filter(l => l.status?.toUpperCase() === 'SCHEDULED').length;

  if (loading) {
    return <MaintenanceSkeleton />;
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      
      {/* LEFT PANEL: ACTIVE LOGS (Master List) */}
      <section className="w-[320px] lg:w-[380px] flex-shrink-0 bg-white border-r border-border flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-base font-bold text-primary">Active Logs</h2>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all focus:outline-none shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">add</span>
              <span>New</span>
            </button>
          </div>

          {/* Local Status filter tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => setStatusFilter('ALL')}
              className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
                statusFilter === 'ALL' 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-secondary-container text-secondary hover:bg-secondary-container/85'
              }`}
            >
              All {logs.length}
            </button>
            <button 
              onClick={() => setStatusFilter('IN SHOP')}
              className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
                statusFilter === 'IN SHOP' 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-secondary-container text-secondary hover:bg-secondary-container/85'
              }`}
            >
              In Shop {countInShop}
            </button>
            <button 
              onClick={() => setStatusFilter('SCHEDULED')}
              className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
                statusFilter === 'SCHEDULED' 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-secondary-container text-secondary hover:bg-secondary-container/85'
              }`}
            >
              Scheduled {countScheduled}
            </button>
          </div>
        </div>

        {/* Master List Cards */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <MaintenanceCard 
                key={log.id} 
                log={log} 
                isSelected={selectedLog?.id === log.id}
                onClick={() => handleSelectLog(log)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-secondary text-xs italic bg-white border border-border rounded-2xl shadow-sm">
              No matching active logs found.
            </div>
          )}
        </div>
      </section>

      {/* RIGHT PANEL: DETAIL VIEW */}
      <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar relative">
        {selectedLog ? (
          <div className="p-8 flex flex-col flex-1">
            
            {/* Detail Header */}
            <div className="flex justify-between items-start mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3.5 mb-2 flex-wrap">
                  <h3 className="font-headline-md text-primary font-black text-2xl leading-none">
                    {selectedLog.vehicleId}
                  </h3>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    selectedLog.status?.toUpperCase() === 'IN SHOP' 
                      ? 'bg-warning-orange-container text-on-warning-orange'
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {selectedLog.status}
                  </span>
                </div>
                <p className="text-xs text-secondary font-semibold">
                  {selectedLog.vehicleClass} &bull; {selectedLog.description}
                </p>
                {selectedLog.assignedTechnician && (
                  <p className="text-[11px] text-primary font-bold mt-1">
                    Technician Assigned: <span className="text-transit-blue">{selectedLog.assignedTechnician}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0 relative">
                <div className="relative">
                  <button 
                    onClick={() => setShowTechnicianDropdown(!showTechnicianDropdown)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-2xl hover:bg-secondary-container active:scale-95 shadow-sm transition-all focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-transit-blue text-[18px]">person</span>
                    <span className="text-xs font-bold text-primary">Assign Tech</span>
                  </button>

                  {/* Technician Dropdown Overlay */}
                  {showTechnicianDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-2xl shadow-lg py-2 z-20 animate-fade-in">
                      <p className="px-4 py-1.5 text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-border/40">Select Technician</p>
                      {technicians.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => handleAssignTechnician(tech)}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-secondary-container/40 text-primary transition-colors flex items-center justify-between"
                        >
                          <span>{tech}</span>
                          {selectedLog.assignedTechnician === tech && (
                            <span className="material-symbols-outlined text-[16px] text-transit-blue">check</span>
                          )}
                        </button>
                      ))}
                      {selectedLog.assignedTechnician && (
                        <button
                          onClick={() => handleAssignTechnician('')}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-error hover:bg-error-container/20 transition-colors border-t border-border/40 mt-1"
                        >
                          Unassign
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleCloseRecord}
                  className="flex items-center gap-2 px-5 py-2.5 bg-error text-on-error rounded-2xl hover:bg-error/95 hover:shadow-md active:scale-95 shadow-sm transition-all focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span className="text-xs font-bold">Close Record</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border mb-8 select-none">
              <nav className="flex gap-8">
                {['Summary', 'Costs & Billing', 'Photos & Records', 'Schedule'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-bold text-xs tracking-wider uppercase transition-all focus:outline-none ${
                      activeTab === tab 
                        ? 'border-b-2 border-primary text-primary' 
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content panel */}
            <div className="flex-1 min-h-0 animate-fade-in">
              {activeTab === 'Summary' && (
                <div className="space-y-8">
                  {/* Health check & image visualization */}
                  <VehicleStatusCard log={selectedLog} />

                  {/* SVG progress tracker */}
                  <EstimatedCompletionCard 
                    log={selectedLog} 
                    onAdjustClick={() => setIsAdjustOpen(true)}
                  />

                  {/* Form to submit history */}
                  <MaintenanceForm onSubmit={handleFormSubmit} />

                  {/* Service history table */}
                  <MaintenanceTable history={history} />
                </div>
              )}

              {activeTab === 'Costs & Billing' && (
                <div className="bg-white p-6 rounded-3xl border border-border/60 soft-shadow space-y-6">
                  <div className="flex justify-between items-center border-b border-border/40 pb-4">
                    <h3 className="font-headline-md text-base font-bold text-primary uppercase tracking-tight">Costs Breakdown</h3>
                    <span className="text-xs font-bold bg-transit-blue-container text-transit-blue px-3 py-1 rounded-full">
                      Invoice Generated
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-background p-4 rounded-2xl border border-border/40">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Parts Costs</p>
                      <p className="font-headline-md text-xl font-black text-primary mt-1">$490.00</p>
                    </div>
                    <div className="bg-background p-4 rounded-2xl border border-border/40">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Labor Costs</p>
                      <p className="font-headline-md text-xl font-black text-primary mt-1">$350.00</p>
                    </div>
                    <div className="bg-background p-4 rounded-2xl border border-border/40">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Invoice</p>
                      <p className="font-headline-md text-xl font-black text-transit-blue mt-1">$840.00</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border/40">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-secondary-container/30">
                        <tr>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-secondary uppercase tracking-wider">Item Description</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-secondary uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-2.5 text-[10px] font-bold text-secondary uppercase tracking-wider text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-xs text-primary">
                        <tr className="hover:bg-secondary-container/10">
                          <td className="px-4 py-3 font-semibold">Engine Diagnostic Sensors (Replacement)</td>
                          <td className="px-4 py-3">2</td>
                          <td className="px-4 py-3 text-right font-semibold">$380.00</td>
                        </tr>
                        <tr className="hover:bg-secondary-container/10">
                          <td className="px-4 py-3 font-semibold">Premium Synthetic Oil & Filter kit</td>
                          <td className="px-4 py-3">1</td>
                          <td className="px-4 py-3 text-right font-semibold">$110.00</td>
                        </tr>
                        <tr className="hover:bg-secondary-container/10">
                          <td className="px-4 py-3 font-semibold">Diagnostics Lab / Mechanics Hours</td>
                          <td className="px-4 py-3">3.5 hrs</td>
                          <td className="px-4 py-3 text-right font-semibold">$350.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Photos & Records' && (
                <div className="bg-white p-6 rounded-3xl border border-border/60 soft-shadow space-y-6">
                  <h3 className="font-headline-md text-base font-bold text-primary uppercase tracking-tight">Diagnostics Reports & Photos</h3>
                  
                  {/* Check list */}
                  <div className="bg-background p-4.5 rounded-2xl border border-border/40 space-y-3">
                    <h4 className="text-xs font-bold text-primary mb-2">Service Completion Checklist</h4>
                    {[
                      { id: 'check-1', label: 'Engine error codes scanned and cleared', done: true },
                      { id: 'check-2', label: 'Oil levels drained and synthetic refill added', done: true },
                      { id: 'check-3', label: 'Sensors calibrated to manufacturer parameters', done: false },
                      { id: 'check-4', label: 'Road test completed under heavy cargo load', done: false }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer text-xs text-primary font-semibold select-none">
                        <input 
                          type="checkbox" 
                          defaultChecked={item.done}
                          className="w-4 h-4 rounded text-transit-blue border-border focus:ring-0 cursor-pointer"
                        />
                        <span className={item.done ? 'line-through text-secondary' : ''}>{item.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Photo grid mock */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2].map((num) => (
                      <div key={num} className="aspect-square bg-background border border-border/50 rounded-2xl overflow-hidden relative group cursor-pointer hover:border-transit-blue transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                          <span className="material-symbols-outlined text-secondary group-hover:text-primary text-[28px] transition-colors">image</span>
                        </div>
                        <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-white px-2 py-0.5 rounded-full shadow-sm text-primary uppercase">
                          Report Photo {num}
                        </span>
                      </div>
                    ))}
                    <div className="aspect-square border border-dashed border-border hover:border-transit-blue rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <span className="material-symbols-outlined text-secondary group-hover:text-transit-blue text-[24px] mb-1.5 transition-colors">add_a_photo</span>
                      <span className="text-[10px] font-bold text-secondary group-hover:text-transit-blue transition-colors">Upload Photo</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Schedule' && (
                <div className="bg-white p-6 rounded-3xl border border-border/60 soft-shadow space-y-6">
                  <h3 className="font-headline-md text-base font-bold text-primary uppercase tracking-tight">Upcoming Scheduled Services</h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Full Brake System Inspection', due: 'In 3,200 km', desc: 'Required inspect and fluid flush.', date: '18 Aug 2026', icon: 'settings_backup_restore' },
                      { title: 'Air & Cabin Filters Replacement', due: 'In 8,000 km', desc: 'Standard replacement for logistics vehicles.', date: '10 Oct 2026', icon: 'filter_alt' },
                      { title: 'Annual Safety & Emissions Check', due: 'Due 12 Dec 2026', desc: 'Statutory compliance safety inspection.', date: '12 Dec 2026', icon: 'verified' }
                    ].map((svc, i) => (
                      <div key={i} className="flex gap-4 p-4 hover:bg-secondary-container/20 rounded-2xl transition-colors border border-border/30">
                        <div className="w-10 h-10 bg-secondary-container/60 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px]">{svc.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start flex-wrap gap-1.5">
                            <h4 className="text-xs font-bold text-primary">{svc.title}</h4>
                            <span className="text-[9px] font-bold bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full uppercase">
                              {svc.due}
                            </span>
                          </div>
                          <p className="text-[10px] text-secondary mt-0.5">{svc.desc}</p>
                          <p className="text-[10px] text-transit-blue font-semibold mt-1">Scheduled for: {svc.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <span className="material-symbols-outlined text-[64px] text-secondary mb-4 opacity-40">build_circle</span>
            <h3 className="font-headline-md text-lg font-bold text-primary mb-1">No Active Maintenance Record</h3>
            <p className="text-xs text-secondary max-w-sm">
              Select a vehicle log from the active list, or click 'New' to initialize a new maintenance log.
            </p>
          </div>
        )}

        {/* FAB chat helper */}
        <button 
          onClick={() => toast('Direct message assistant coming soon!')}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30 focus:outline-none"
          title="Chat Assistant"
        >
          <span className="material-symbols-outlined text-[28px]">chat</span>
        </button>
      </section>

      {/* Creation Modal */}
      <MaintenanceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode="create"
        onSubmit={handleCreateRecord}
      />

      {/* Adjust Schedule Modal */}
      <MaintenanceModal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        mode="adjust"
        log={selectedLog}
        onSubmit={handleAdjustSchedule}
      />
    </div>
  );
};

export default Maintenance;
