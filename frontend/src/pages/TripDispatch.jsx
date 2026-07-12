import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tripService, vehicleService, driverService } from '../services/tripService';
import LiveBoard from '../components/LiveBoard';
import TripForm from '../components/TripForm';
import MapPanel from '../components/MapPanel';
import TruckVisualization from '../components/TruckVisualization';
import FloatingActionButton from '../components/FloatingActionButton';
import OperationalTimeline from '../components/OperationalTimeline';

const TripDispatch = ({ searchQuery, currentRole }) => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  // Validation / Loading States
  const [loading, setLoading] = useState(true);
  const [weightLimitError, setWeightLimitError] = useState(null);

  // Complete Trip Form States
  const [isCompleting, setIsCompleting] = useState(false);
  const [finalOdometer, setFinalOdometer] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getTrips(),
        vehicleService.getAvailableVehicles(),
        driverService.getAvailableDrivers(),
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
      
      // Auto-select the first trip if none is selected
      if (tripsData.length > 0 && !selectedTrip) {
        const firstTrip = tripsData[0];
        updateSelectedTripDetail(firstTrip);
      } else if (selectedTrip) {
        // Refresh selected trip detail
        const updated = tripsData.find(t => t.id === selectedTrip.id);
        if (updated) {
          updateSelectedTripDetail(updated);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load console data. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSelectedTripDetail = async (trip) => {
    let tripDetail = { ...trip };
    
    // If active (Dispatched or In-Transit), retrieve OSRM ETA from the backend
    if (trip.status === 'Dispatched' || trip.status === 'In-Transit') {
      try {
        const etaData = await tripService.getTripEta(trip.id);
        if (etaData && etaData.eta) {
          tripDetail.eta = etaData.eta;
        }
      } catch (err) {
        console.warn('Could not fetch OSRM ETA: ', err);
      }
    }
    setSelectedTrip(tripDetail);
  };

  const handleSelectTrip = (trip) => {
    setIsCompleting(false);
    updateSelectedTripDetail(trip);
  };

  // Form submission handler to create a new Draft trip
  const handleCreateTrip = async (data) => {
    try {
      const newTrip = await tripService.createTrip(data);
      toast.success(`Draft Trip ${newTrip.trip_code} Initialized!`);
      await fetchData();
      updateSelectedTripDetail(newTrip);
    } catch (err) {
      console.error(err);
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach(msg => toast.error(msg));
      } else {
        toast.error('Error creating trip. Verify your parameters.');
      }
    }
  };

  // Life-cycle transition: Dispatch Draft → Dispatched
  const handleDispatchTrip = async () => {
    if (!selectedTrip) return;
    try {
      const updated = await tripService.dispatchTrip(selectedTrip.id);
      toast.success(`Trip ${updated.trip_code} successfully Dispatched!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach(msg => toast.error(msg));
      } else {
        toast.error(err.response?.data?.detail || 'Dispatch request failed.');
      }
    }
  };

  // Life-cycle transition: Cancel Dispatched → Cancelled
  const handleCancelTrip = async () => {
    if (!selectedTrip) return;
    if (!window.confirm(`Are you sure you want to cancel Trip ${selectedTrip.trip_code}?`)) return;
    try {
      const updated = await tripService.cancelTrip(selectedTrip.id);
      toast.success(`Trip ${updated.trip_code} Cancelled.`);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel trip.');
    }
  };

  // Life-cycle transition: Complete Dispatched → Completed
  const handleCompleteTripSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrip || !finalOdometer || !fuelConsumed) return;

    const currentOdometer = selectedTrip.vehicle?.odometer || 0;
    if (parseInt(finalOdometer) <= currentOdometer) {
      toast.error(`Final odometer must exceed the vehicle's current odometer (${currentOdometer} km).`);
      return;
    }

    try {
      const updated = await tripService.completeTrip(selectedTrip.id, finalOdometer, fuelConsumed);
      toast.success(`Trip ${updated.trip_code} Completed! Vehicle odometer updated.`);
      setIsCompleting(false);
      setFinalOdometer('');
      setFuelConsumed('');
      await fetchData();
    } catch (err) {
      console.error(err);
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach(msg => toast.error(msg));
      } else {
        toast.error('Completion request failed. Check input variables.');
      }
    }
  };

  const handleManualDispatchScroll = () => {
    const destInput = document.querySelector('input[placeholder="Enter destination..."]');
    if (destInput) {
      destInput.focus();
      destInput.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine progress bar attributes based on selected trip status
  const getProgressState = () => {
    if (!selectedTrip) return { percent: 0, step: 0 };
    switch (selectedTrip.status) {
      case 'Draft': return { percent: 10, step: 1 };
      case 'Dispatched': return { percent: 35, step: 2 };
      case 'In-Transit': return { percent: 64, step: 3 };
      case 'Completed': return { percent: 100, step: 4 };
      default: return { percent: 0, step: 0 }; // Cancelled/None
    }
  };

  const progress = getProgressState();

  // Helper variables for live detail card
  const isDraft = selectedTrip?.status === 'Draft';
  const isActive = selectedTrip?.status === 'Dispatched' || selectedTrip?.status === 'In-Transit';
  const isCompleted = selectedTrip?.status === 'Completed';
  const isCancelled = selectedTrip?.status === 'Cancelled';

  const driverName = selectedTrip?.driver
    ? (typeof selectedTrip.driver === 'object' ? selectedTrip.driver.name : `Driver #${selectedTrip.driver}`)
    : 'No Driver Assigned';

  const driverAvatar = typeof selectedTrip?.driver === 'object' && selectedTrip.driver.avatarUrl ? selectedTrip.driver.avatarUrl : "https://api.dicebear.com/7.x/initials/svg?seed=Driver";
  
  const vehicleMaxLoad = selectedTrip?.vehicle 
    ? parseFloat(typeof selectedTrip.vehicle === 'object' ? selectedTrip.vehicle.max_load_capacity_kg : 2000)
    : 2000;

  const isOverloaded = selectedTrip && parseFloat(selectedTrip.cargo_weight_kg) > vehicleMaxLoad;

  const getStatusBadgeClass = (status) => {
    const base = "text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide ";
    if (status === 'Draft') return `${base} bg-secondary-container text-secondary`;
    if (status === 'Completed') return `${base} bg-success-green-container text-on-success-green`;
    if (status === 'Cancelled') return `${base} bg-error-container text-on-error-container`;
    if (status === 'In-Transit') return `${base} bg-transit-blue-container text-transit-blue`;
    return `${base} bg-warning-orange-container text-on-warning-orange`; // Dispatched
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-background relative">
      {/* LEFT PANEL: LIVE BOARD */}
      <LiveBoard
        trips={trips}
        selectedTrip={selectedTrip}
        onSelectTrip={handleSelectTrip}
        searchQuery={searchQuery}
      />

      {/* CENTER & RIGHT CONTENT SPLIT */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 bg-background">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          
          {/* CENTER PANEL COLUMN: Create Trip (top) & Map Panel (bottom) */}
          <div className="flex flex-col gap-6">
            <TripForm
              vehicles={vehicles}
              drivers={drivers}
              onCreateTrip={handleCreateTrip}
              weightLimitError={weightLimitError}
              setWeightLimitError={setWeightLimitError}
            />
            
            <div className="h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm">
              <MapPanel selectedTrip={selectedTrip} />
            </div>
          </div>

          {/* RIGHT PANEL COLUMN: Trip Preview Card & Timeline & Truck Visualization (bottom) */}
          <div className="flex flex-col gap-6">
            {selectedTrip ? (
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 relative">
                
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-surface-container rounded-xl overflow-hidden border border-border flex-shrink-0">
                      <img 
                        className="w-full h-full object-cover grayscale" 
                        alt="Vehicle icon"
                        src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-lg text-primary leading-none">{selectedTrip.trip_code}</h3>
                        <span className={getStatusBadgeClass(selectedTrip.status)}>
                          <span className="material-symbols-outlined text-[12px] font-bold">local_shipping</span> 
                          {selectedTrip.status}
                        </span>
                      </div>
                      <p className="text-xs text-secondary mt-1.5 font-semibold">
                        {selectedTrip.source} → {selectedTrip.destination}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">ETA</p>
                      <p className="text-lg font-black text-transit-blue mt-0.5">{selectedTrip.eta || '08:45 PM'}</p>
                    </div>
                  )}
                </div>

                {/* Card Body: Driver & Payload */}
                <div className="border-t border-b border-border py-4 flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden flex-shrink-0 border border-border">
                      <img className="w-full h-full object-cover" alt="Driver Profile" src={driverAvatar} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Driver</p>
                      <p className="text-sm font-bold text-primary truncate max-w-[120px] mt-0.5">{driverName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Payload</p>
                      <p className="text-sm font-bold text-primary mt-0.5">
                        {parseFloat(selectedTrip.cargo_weight_kg)} kg 
                        <span className="text-secondary font-normal text-xs ml-1">
                          / {vehicleMaxLoad}
                        </span>
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    {isDraft && (
                      <button 
                        onClick={handleDispatchTrip}
                        disabled={isOverloaded}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
                          isOverloaded
                            ? 'bg-transit-blue/20 text-on-transit-blue/50 cursor-not-allowed shadow-none'
                            : 'bg-transit-blue text-white hover:bg-transit-blue/90 hover:-translate-y-0.5 hover:shadow-md'
                        }`}
                      >
                        Dispatch Trip
                      </button>
                    )}
                    
                    {isActive && !isCompleting && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toast.success(`Calling Driver ${driverName}...`, { icon: '📞', id: 'call-driver' })}
                          className="bg-primary text-on-primary px-4.5 py-2.5 rounded-2xl text-xs font-bold hover:bg-primary-container hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-1.5 shadow-sm focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">phone</span>
                          Call Driver
                        </button>
                        <button 
                          onClick={() => setIsCompleting(true)}
                          className="bg-success-green text-white px-4 py-2 rounded-2xl text-xs font-bold hover:bg-success-green/90 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200"
                        >
                          Complete
                        </button>
                        <button 
                          onClick={handleCancelTrip}
                          className="bg-error text-white px-4 py-2 rounded-2xl text-xs font-bold hover:bg-error/90 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {(isCompleted || isCancelled) && (
                      <div className={`text-xs font-bold uppercase tracking-wider ${
                        isCompleted ? 'text-success-green' : 'text-error'
                      }`}>
                        {isCompleted ? 'DELIVERED' : 'ABORTED'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Inputs Overlay */}
                {isCompleting && (
                  <form onSubmit={handleCompleteTripSubmit} className="bg-surface-container border border-border p-4.5 rounded-2xl mb-6 space-y-4 shadow-inner">
                    <p className="text-xs font-bold uppercase tracking-wider text-transit-blue">Complete Trip Parameters</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-secondary">Final Odometer (km)</label>
                        <input 
                          required
                          type="number"
                          placeholder={`> ${selectedTrip.vehicle?.odometer || 0}`}
                          value={finalOdometer}
                          onChange={(e) => setFinalOdometer(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-transit-blue focus:border-transit-blue focus:outline-none shadow-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-secondary">Fuel Consumed (Liters)</label>
                        <input 
                          required
                          type="number"
                          step="0.1"
                          placeholder="e.g. 45.5"
                          value={fuelConsumed}
                          onChange={(e) => setFuelConsumed(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-transit-blue focus:border-transit-blue focus:outline-none shadow-sm font-semibold"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button 
                        type="button"
                        onClick={() => setIsCompleting(false)}
                        className="px-4 py-2 bg-white border border-border text-secondary rounded-xl text-[11px] font-bold hover:bg-secondary-container hover:text-primary transition-all duration-200 active:scale-95"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-success-green text-white rounded-xl text-[11px] font-bold hover:bg-success-green/90 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95"
                      >
                        Confirm Complete
                      </button>
                    </div>
                  </form>
                )}

                {/* Shipment Progress */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Shipment Progress</p>
                    <p className="text-xl font-black text-primary">{isCancelled ? '0%' : `${progress.percent}%`}</p>
                  </div>
                  
                  <div className="relative pt-2 pb-8">
                    <div className="absolute top-4 left-0 w-full h-1 bg-surface-container-high rounded-full"></div>
                    <div 
                      className="absolute top-4 left-0 h-1 bg-transit-blue rounded-full transition-all duration-500" 
                      style={{ width: isCancelled ? '0%' : `${progress.percent}%` }}
                    ></div>
                    
                    <div className="flex justify-between relative">
                      {/* Step 1: Confirmed */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                          isCancelled 
                            ? 'bg-secondary text-white' 
                            : (progress.step >= 1 ? 'bg-transit-blue text-white' : 'bg-white border-2 border-border')
                        }`}>
                          {progress.step >= 1 && !isCancelled ? (
                            <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                          ) : ''}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-secondary">Confirmed</span>
                      </div>

                      {/* Step 2: Prepared */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                          isCancelled 
                            ? 'bg-secondary text-white'
                            : (progress.step >= 2 ? 'bg-transit-blue text-white' : (progress.step === 1 ? 'bg-white border-2 border-transit-blue' : 'bg-white border-2 border-border'))
                        }`}>
                          {progress.step >= 2 && !isCancelled ? (
                            <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                          ) : ''}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-secondary">Prepared</span>
                      </div>

                      {/* Step 3: In Transit */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                          isCancelled
                            ? 'bg-secondary text-white'
                            : (progress.step >= 3 ? 'bg-transit-blue text-white' : (progress.step === 2 ? 'bg-white border-2 border-transit-blue' : 'bg-white border-2 border-border'))
                        }`}>
                          {progress.step >= 3 && !isCancelled ? (
                            <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                          ) : ''}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-secondary">In Transit</span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                          progress.step >= 4 && !isCancelled ? 'bg-success-green text-white' : 'bg-white border-2 border-border'
                        }`}>
                          {progress.step >= 4 && !isCancelled ? (
                            <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                          ) : ''}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-secondary">Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-border shadow-sm text-center text-secondary">
                <span className="material-symbols-outlined text-[48px] block mb-2 text-outline">info</span>
                <p className="text-sm">No Trip Selected. Start by initializing a request or select an active board card.</p>
              </div>
            )}

            {/* WARNING BANNER */}
            {selectedTrip && (isOverloaded || (selectedTrip.vehicle?.registration_number === 'VH-002' && isActive)) && (
              <div className={`${
                isOverloaded 
                  ? 'bg-error-container/30 border border-error/20 text-on-error-container' 
                  : 'bg-warning-orange-container/65 border border-warning-orange/20 text-on-warning-orange'
              } p-4.5 rounded-2xl flex items-start justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${
                    isOverloaded ? 'bg-error-container' : 'bg-warning-orange-container'
                  } rounded-xl flex items-center justify-center flex-shrink-0 border border-border/10`}>
                    <span className={`material-symbols-outlined ${
                      isOverloaded ? 'text-error' : 'text-warning-orange'
                    } text-[22px]`}>warning</span>
                  </div>
                  <div>
                    {isOverloaded ? (
                      <div>
                        <p className="text-sm font-bold text-error">Trip Overload: {selectedTrip.trip_code}</p>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                          Cargo payload of {selectedTrip.cargo_weight_kg} kg exceeds assigned vehicle limit of {vehicleMaxLoad} kg. Dispatch action is blocked.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-warning-orange">Trip Delayed: {selectedTrip.vehicle?.registration_number || 'VH-002'}</p>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                          Engine warning light reported by driver at 10:14 AM near Indianapolis.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!isOverloaded && (
                  <button className="text-sm font-bold text-transit-blue hover:underline focus:outline-none flex-shrink-0 pt-2">
                    Re-route
                  </button>
                )}
              </div>
            )}

            {/* OPERATIONAL TIMELINE */}
            <OperationalTimeline selectedTrip={selectedTrip} />
            
            {/* TRUCK VISUALIZATION PANEL */}
            <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
              <TruckVisualization selectedTrip={selectedTrip} />
            </div>
          </div>

        </div>
      </div>

      {/* FAB FOR QUICK ACTION */}
      <FloatingActionButton onClick={handleManualDispatchScroll} />
    </div>
  );
};

export default TripDispatch;
