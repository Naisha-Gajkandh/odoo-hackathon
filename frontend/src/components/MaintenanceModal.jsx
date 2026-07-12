import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const MaintenanceModal = ({ isOpen, onClose, mode = 'create', log, onSubmit }) => {
  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('Engine Diagnostic');
  const [vehicleType, setVehicleType] = useState('Heavy-Duty Semi');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN SHOP');
  const [engineIntegrity, setEngineIntegrity] = useState(80);
  const [targetCompletion, setTargetCompletion] = useState('04:30 PM Today');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completionNotes, setCompletionNotes] = useState('');

  // Sync state with selected log when adjusting
  useEffect(() => {
    if (isOpen) {
      if (mode === 'adjust' && log) {
        setCompletionPercentage(log.completionPercentage || 0);
        setTargetCompletion(log.targetCompletion || '');
        setCompletionNotes(log.completionNotes || '');
      } else {
        // Reset to default for creation
        setVehicleId('');
        setServiceType('Engine Diagnostic');
        setVehicleType('Heavy-Duty Semi');
        setDescription('');
        setStatus('IN SHOP');
        setEngineIntegrity(80);
        setTargetCompletion('04:30 PM Today');
      }
    }
  }, [isOpen, mode, log]);

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      if (!vehicleId.trim() || !serviceType.trim() || !description.trim()) {
        toast.error('Please fill in all required fields.');
        return;
      }
      onSubmit({
        vehicleId: vehicleId.trim().toUpperCase(),
        serviceType,
        vehicleType,
        description,
        status,
        engineIntegrity: parseInt(engineIntegrity) || 100,
        targetCompletion,
        completionPercentage: status === 'Scheduled' ? 0 : 25,
        timeText: status === 'Scheduled' ? 'Pending Arrival' : 'Since Just Now',
        completionNotes: status === 'Scheduled' 
          ? 'Vehicle is currently on route, expected arrival soon.'
          : 'Diagnostics initialized.',
        icon: serviceType.toLowerCase().includes('oil') ? 'oil_barrel' : 'build'
      });
    } else {
      onSubmit({
        completionPercentage: parseInt(completionPercentage),
        targetCompletion,
        completionNotes
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-border/60 z-10 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-base font-bold text-primary">
            {mode === 'create' ? 'Create New Maintenance Record' : `Adjust Schedule: ${log?.vehicleId}`}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:bg-secondary-container hover:text-primary transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'create' ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Vehicle ID *</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                  type="text"
                  placeholder="e.g. YR-34DFR734W2"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Service Type</label>
                  <select
                    className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  >
                    <option value="Engine Diagnostic">Engine Diagnostic</option>
                    <option value="Brake Pad Replacement">Brake Pad Replacement</option>
                    <option value="Sensor Calibration">Sensor Calibration</option>
                    <option value="Routine Oil Change">Routine Oil Change</option>
                    <option value="Tire Replacement">Tire Replacement</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Vehicle Type</label>
                  <select
                    className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="Heavy-Duty Semi">Heavy-Duty Semi</option>
                    <option value="Medium Truck">Medium Truck</option>
                    <option value="Logistics Van">Logistics Van</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="IN SHOP">IN SHOP</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Engine Health (0-100)</label>
                  <input
                    className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                    type="number"
                    min="0"
                    max="100"
                    value={engineIntegrity}
                    onChange={(e) => setEngineIntegrity(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Target Completion</label>
                <input
                  className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                  type="text"
                  placeholder="e.g. 04:30 PM Today"
                  value={targetCompletion}
                  onChange={(e) => setTargetCompletion(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Problem Description *</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold resize-none"
                  placeholder="Describe the issue or diagnostic steps required..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Completion Progress ({completionPercentage}%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full h-1.5 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
                    value={completionPercentage}
                    onChange={(e) => setCompletionPercentage(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Target Completion Time</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
                  type="text"
                  value={targetCompletion}
                  onChange={(e) => setTargetCompletion(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Update Notes</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold resize-none"
                  placeholder="Provide status notes or technician update updates..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-secondary-container text-secondary hover:bg-secondary-container/85 font-bold rounded-xl text-xs transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-on-primary hover:bg-primary/90 font-bold rounded-xl text-xs active:scale-[0.98] transition-all uppercase tracking-wider focus:outline-none shadow-sm"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;
