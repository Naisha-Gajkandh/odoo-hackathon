import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const TripForm = ({ vehicles, drivers, onCreateTrip, weightLimitError, setWeightLimitError }) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      source: 'Mumbai Terminal',
      destination: 'Pune Depot',
      vehicle: '',
      driver: '',
      cargo_weight_kg: 700,
      planned_distance_km: 100, // Defaults to 100 in background
    }
  });

  const selectedVehicleId = watch('vehicle');
  const cargoWeight = watch('cargo_weight_kg');

  // Find selected vehicle object
  const selectedVehicle = vehicles.find(
    (v) => v.id.toString() === selectedVehicleId?.toString()
  );
  
  const vehicleCapacity = selectedVehicle ? parseFloat(selectedVehicle.max_load_capacity_kg) : 2000;

  // Real-time capacity check
  useEffect(() => {
    if (selectedVehicle && cargoWeight) {
      const weight = parseFloat(cargoWeight);
      if (weight > vehicleCapacity) {
        setWeightLimitError(`Capacity exceeded by ${weight - vehicleCapacity} kg - dispatch blocked.`);
      } else {
        setWeightLimitError(null);
      }
    } else {
      setWeightLimitError(null);
    }
  }, [selectedVehicleId, cargoWeight, vehicleCapacity, setWeightLimitError]);

  const onSubmit = (data) => {
    if (weightLimitError) return;
    onCreateTrip(data);
  };

  const inputClasses = "w-full bg-white border border-border rounded-2xl pl-9 pr-4 py-2.5 text-sm transition-all duration-200 hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none shadow-sm placeholder-secondary/50 font-medium";
  const selectClasses = "w-full bg-white border border-border rounded-2xl px-4 py-2.5 text-sm appearance-none transition-all duration-200 hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none shadow-sm cursor-pointer font-medium text-primary";
  const labelClasses = "text-[10px] font-bold uppercase text-secondary tracking-widest";

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-primary text-[18px] font-black">Create New Trip</h2>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
          Step 1 of 2
        </span>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClasses}>Source</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
                location_on
              </span>
              <input 
                {...register('source', { required: 'Source is required' })}
                className={inputClasses}
                type="text"
              />
            </div>
            {errors.source && <p className="text-error text-[10px] font-bold mt-1">{errors.source.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className={labelClasses}>Destination</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
                flag
              </span>
              <input 
                {...register('destination', { required: 'Destination is required' })}
                className={inputClasses}
                placeholder="Enter destination..." 
                type="text"
              />
            </div>
            {errors.destination && <p className="text-error text-[10px] font-bold mt-1">{errors.destination.message}</p>}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={labelClasses}>Vehicle Assignment</label>
            <div className="relative">
              <select 
                {...register('vehicle', { required: 'Vehicle is required' })}
                className={selectClasses}
              >
                <option value="">Select available vehicle...</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registration_number} ({v.name_model}) - Limit: {parseFloat(v.max_load_capacity_kg)}kg
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
            {errors.vehicle && <p className="text-error text-[10px] font-bold mt-1">{errors.vehicle.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className={labelClasses}>Driver</label>
            <div className="relative">
              <select 
                {...register('driver', { required: 'Driver is required' })}
                className={selectClasses}
              >
                <option value="">Select driver...</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.license_expired ? '(Expired License)' : ''}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
            {errors.driver && <p className="text-error text-[10px] font-bold mt-1">{errors.driver.message}</p>}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Cargo Weight (kg)</label>
            <div className="flex items-center gap-3">
              <input 
                {...register('cargo_weight_kg', { 
                  required: 'Weight is required',
                  min: { value: 1, message: 'Weight must be positive' }
                })}
                className="w-1/2 bg-white border border-border rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none shadow-sm" 
                type="number"
              />
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[16px] text-outline">info</span>
                <span className="text-[11px] font-semibold text-secondary">
                  Limit: {vehicleCapacity}kg
                </span>
              </div>
            </div>
            {errors.cargo_weight_kg && <p className="text-error text-[10px] font-bold mt-1">{errors.cargo_weight_kg.message}</p>}
          </div>
        </div>
        
        {weightLimitError && (
          <div className="text-error text-xs font-bold bg-error-container/30 border border-error/20 p-3 rounded-2xl flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>{weightLimitError}</span>
          </div>
        )}

        <button 
          type="submit"
          disabled={!isValid || !!weightLimitError}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm ${
            (!isValid || weightLimitError)
              ? 'bg-primary/40 text-on-primary/60 cursor-not-allowed shadow-none'
              : 'bg-primary text-on-primary hover:bg-primary-container hover:-translate-y-0.5 hover:shadow-md'
          }`}
        >
          Initialize Trip Request
        </button>
      </form>
    </div>
  );
};

export default TripForm;
