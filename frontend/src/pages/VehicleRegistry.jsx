import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { vehicleService } from '../services/tripService';

const VehicleRegistry = ({ searchQuery }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('Vehicle Info');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
      if (data.length > 0) {
        setSelectedVehicle(data[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load vehicle registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleRetire = async () => {
    if (!selectedVehicle) return;
    if (!window.confirm(`Are you sure you want to retire vehicle ${selectedVehicle.registration_number}?`)) return;
    try {
      await vehicleService.retireVehicle(selectedVehicle.id);
      toast.success(`Vehicle ${selectedVehicle.registration_number} retired successfully.`);
      fetchVehicles();
    } catch (err) {
      console.error(err);
      toast.error('Failed to retire vehicle.');
    }
  };

  // Filter & Search Logic
  const filteredVehicles = vehicles.filter(v => {
    // 1. Status filter
    if (filter === 'AVAILABLE') {
      if (v.status !== 'Available') return false;
    } else if (filter === 'ON_TRIP') {
      if (v.status !== 'On Trip') return false;
    }

    // 2. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const regMatch = v.registration_number?.toLowerCase().includes(q);
      const modelMatch = v.name_model?.toLowerCase().includes(q);
      return regMatch || modelMatch;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide ";
    if (status === 'Available') {
      return (
        <span className={`${base} bg-success-green-container text-on-success-green`}>
          <span className="w-1.5 h-1.5 bg-success-green rounded-full"></span>
          AVAILABLE
        </span>
      );
    }
    if (status === 'On Trip') {
      return (
        <span className={`${base} bg-transit-blue-container text-transit-blue`}>
          <span className="w-1.5 h-1.5 bg-transit-blue rounded-full animate-pulse"></span>
          ON ROUTE
        </span>
      );
    }
    return (
      <span className={`${base} bg-secondary-container text-secondary`}>
        <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
        IN SHOP
      </span>
    );
  };

  const countAvailable = vehicles.filter(v => v.status === 'Available').length;
  const countOnTrip = vehicles.filter(v => v.status === 'On Trip').length;

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      
      {/* LEFT PANEL: VEHICLE LIST */}
      <section className="w-[320px] lg:w-[380px] flex-shrink-0 bg-white border-r border-border flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-primary text-[18px] font-black">Vehicle Registry</h2>
            <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Fleet View
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('ALL')}
              className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
                filter === 'ALL' ? 'bg-primary text-on-primary shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
              }`}
            >
              All {vehicles.length}
            </button>
            <button 
              onClick={() => setFilter('AVAILABLE')}
              className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
                filter === 'AVAILABLE' ? 'bg-success-green text-white shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
              }`}
            >
              Available {countAvailable}
            </button>
            <button 
              onClick={() => setFilter('ON_TRIP')}
              className={`text-[11px] px-3.5 py-1.5 rounded-2xl font-bold transition-all duration-200 focus:outline-none active:scale-95 ${
                filter === 'ON_TRIP' ? 'bg-transit-blue text-white shadow-sm' : 'bg-secondary-container text-secondary hover:bg-secondary-container/80'
              }`}
            >
              On Trip {countOnTrip}
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background">
          {loading ? (
            <div className="p-8 text-center text-secondary text-xs italic">Loading fleet...</div>
          ) : filteredVehicles.length > 0 ? (
            filteredVehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              const loadPercent = v.status === 'On Trip' ? 75 : 0;
              const cardBorder = isSelected 
                ? 'border-2 border-transit-blue shadow-md' 
                : 'border-border hover:border-transit-blue shadow-sm';
              
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVehicle(v)}
                  className={`bg-white p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md ${cardBorder}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Registry No.</span>
                      <p className="font-bold text-sm text-primary">{v.registration_number}</p>
                    </div>
                    {getStatusBadge(v.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="material-symbols-outlined text-outline text-[32px]">
                      {v.type === 'Van' ? 'airport_shuttle' : 'local_shipping'}
                    </span>
                    <div className="flex-1">
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            v.status === 'On Trip' ? 'bg-transit-blue' : 'bg-outline'
                          }`} 
                          style={{ width: `${loadPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-secondary font-semibold">{v.status === 'On Trip' ? '75% Loaded' : 'Empty'}</span>
                        <span className="text-[10px] font-bold text-primary">{v.name_model}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-secondary text-xs italic bg-white border border-border rounded-2xl shadow-sm mt-4">
              No matching vehicles found.
            </div>
          )}
        </div>
      </section>

      {/* RIGHT PANEL: DETAIL VIEW */}
      <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar">
        {selectedVehicle ? (
          <div className="p-8 flex flex-col flex-1">
            
            {/* Header section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3.5 mb-2">
                  <h3 className="font-headline-md text-headline-md text-primary font-black text-2xl">
                    {selectedVehicle.registration_number}
                  </h3>
                  {getStatusBadge(selectedVehicle.status)}
                </div>
                <p className="text-xs text-secondary font-semibold">
                  Model Spec: <span className="font-bold text-primary">{selectedVehicle.name_model}</span> • Odometer: <span className="font-bold text-primary">{selectedVehicle.odometer || 0} km</span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => alert('Message dispatch alert triggered.')}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-border rounded-2xl hover:bg-secondary-container hover:-translate-y-0.5 active:scale-95 shadow-sm transition-all duration-200 group focus:outline-none"
                >
                  <span className="material-symbols-outlined text-transit-blue text-[18px] group-hover:scale-110 transition-transform">chat</span>
                  <span className="text-xs font-bold text-primary">Message Driver</span>
                </button>
                <button 
                  onClick={handleRetire}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-error/25 rounded-2xl hover:bg-error-container/20 hover:-translate-y-0.5 active:scale-95 shadow-sm transition-all duration-200 group focus:outline-none"
                >
                  <span className="material-symbols-outlined text-error text-[18px] group-hover:scale-110 transition-transform">emergency</span>
                  <span className="text-xs font-bold text-error">Retire Vehicle</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border mb-8">
              <nav className="flex gap-8">
                {['Vehicle Info', 'Documents', 'Maintenance', 'History'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-bold text-xs tracking-wider uppercase transition-all focus:outline-none ${
                      activeTab === tab 
                        ? 'border-b-2 border-transit-blue text-transit-blue' 
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Dynamic Tab view */}
            {activeTab === 'Vehicle Info' && (
              <div className="grid grid-cols-12 gap-6 flex-1">
                
                {/* Visual cargo visualization */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-center min-h-[420px]">
                  <h4 className="absolute top-6 left-6 text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary-container px-2.5 py-1 rounded-full">
                    Live Cargo Capacity
                  </h4>
                  
                  <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center pt-8">
                    {/* Simplified Graphic profile */}
                    <div className="w-full relative hover:scale-102 transition-transform duration-500">
                      <img 
                        className="w-full opacity-90 grayscale" 
                        alt="Vehicle registry profile" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaII216ECGC95uo0kMouMFhhDju9IA9FOebpdl_0eeBdyU1lSuTz0oSpYufLdA2HVx5e91ejnvuRwzcDiQMWAyf08N3g3iE4Xz-5x6V2YNDk14DLzzw43U2uivE70XW3nFeIRmlL-JwseLJZ_PaEEynmRJ_V2Wwgez_ijqgvhW-_4N07EPAhbhCx1qEE8dWR3hyKCSjGMwZNVFOulQa7v8vTxfOKfkbaw31QYDC16DoWazpxzKSkUm"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                        <div className="w-[85%] h-12 bg-white/40 border border-white/60 backdrop-blur-sm rounded-2xl overflow-hidden flex items-center px-1">
                          <div 
                            className={`h-10 rounded-xl shadow-inner flex items-center justify-center text-white text-[10px] font-black transition-all duration-1000`} 
                            style={{ 
                              width: selectedVehicle.status === 'On Trip' ? '75%' : '0%', 
                              backgroundColor: selectedVehicle.status === 'On Trip' ? '#2563EB' : '#9CA3AF'
                            }}
                          >
                            {selectedVehicle.status === 'On Trip' ? '75.2% CAPACITY' : 'EMPTY'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center bg-surface-container-low p-4.5 rounded-2xl border border-border">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Current Load</p>
                        <p className="font-bold text-sm text-primary">
                          {selectedVehicle.status === 'On Trip' ? '14,820 kg' : '0 kg'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Capacity Max</p>
                        <p className="font-bold text-sm text-transit-blue">
                          {parseFloat(selectedVehicle.max_load_capacity_kg)} kg
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert('Manifest download triggered.')}
                      className="text-transit-blue font-bold text-xs hover:underline flex items-center gap-1 focus:outline-none"
                    >
                      <span>View Cargo Manifest</span>
                      <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Right sidebar details */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  
                  {/* Model spec card */}
                  <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-transit-blue-container rounded-full flex items-center justify-center mb-4 border border-transit-blue/10">
                      <span className="material-symbols-outlined text-transit-blue text-2xl font-bold">verified</span>
                    </div>
                    <h5 className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Model Spec</h5>
                    <p className="font-bold text-primary text-lg">{selectedVehicle.name_model}</p>
                    <p className="text-xs text-secondary mt-1 font-semibold">Heavy Duty Utility Fleet</p>
                  </div>

                  {/* Spaces stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4.5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                      <span className="material-symbols-outlined text-transit-blue text-[20px] font-bold">aspect_ratio</span>
                      <div className="mt-4">
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Space</p>
                        <p className="font-black text-sm text-primary">{selectedVehicle.status === 'On Trip' ? '75%' : '0%'}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4.5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                      <span className="material-symbols-outlined text-warning-orange text-[20px] font-bold">weight</span>
                      <div className="mt-4">
                        <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Payload</p>
                        <p className="font-black text-sm text-primary">{selectedVehicle.status === 'On Trip' ? '14.8t' : '0t'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Map Mini-View */}
                  <div className="bg-white rounded-2xl border border-border overflow-hidden relative h-44 group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ 
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3t67G_mGpwx38fRxqqxbgFsJTiVhRbO6guTv5SH6vYf-vkH143p8_tVtjQeNovIoYdHnT9Pf1vRW7nZrHntow4lclKaCdQ8PBUSaIgsOerYJdogpyqKOi9xucSnCn_q4BAnmlOR4DffDisX7AOCUh7h1_wjkqxw0OKums6E2I6tHv792Y3hgicGIrC9KaV9ElBwaS2N-tigSe8QkcLwzyxIF6cGcC9jCBBlFnta-jZFyhe0_Czm0M')" 
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">Live Location</p>
                        <p className="text-xs font-black truncate max-w-[150px]">Terminal Area A1</p>
                      </div>
                      <div className="bg-transit-blue p-1.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md">
                        <span className="material-symbols-outlined text-[16px] text-white">open_in_new</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'Documents' && (
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <p className="text-xs font-bold text-transit-blue uppercase tracking-widest mb-2">Registered Documents</p>
                <div className="space-y-3">
                  {['Insurance Policy', 'Vehicle Title', 'Emission Certificate'].map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-surface-container-low border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary">description</span>
                        <span className="text-xs font-bold text-primary">{doc}</span>
                      </div>
                      <button 
                        onClick={() => alert(`Downloading document: ${doc}`)}
                        className="text-xs text-transit-blue font-bold hover:underline focus:outline-none"
                      >
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Maintenance' && (
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <p className="text-xs font-bold text-transit-blue uppercase tracking-widest mb-2">Maintenance History</p>
                <div className="space-y-3">
                  <div className="p-3.5 bg-surface-container-low border border-border rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-primary">Engine Oil & Filter Service</p>
                      <p className="text-[10px] text-secondary mt-1">Completed: 10 days ago • Odometer: 181,200 km</p>
                    </div>
                    <span className="bg-success-green-container text-on-success-green text-[9px] font-bold px-2 py-0.5 rounded-md">COMPLETED</span>
                  </div>
                  <div className="p-3.5 bg-surface-container-low border border-border rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-primary">Tire Pressure Check & Rotation</p>
                      <p className="text-[10px] text-secondary mt-1">Completed: 24 days ago • Odometer: 179,800 km</p>
                    </div>
                    <span className="bg-success-green-container text-on-success-green text-[9px] font-bold px-2 py-0.5 rounded-md">COMPLETED</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'History' && (
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <p className="text-xs font-bold text-transit-blue uppercase tracking-widest mb-2">Trip Logs & Logs History</p>
                <div className="space-y-3">
                  <div className="p-3.5 bg-surface-container-low border border-border rounded-xl">
                    <p className="text-xs font-bold text-primary">Trip Code: TRK-98432</p>
                    <p className="text-[10px] text-secondary mt-1">Source: Hub Chicago → Destination: Milwaukee Terminal</p>
                    <p className="text-[10px] text-transit-blue font-bold mt-1">Status: Completed successfully</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="p-12 text-center text-secondary text-sm">
            No vehicle selected.
          </div>
        )}
      </section>

    </div>
  );
};

export default VehicleRegistry;
