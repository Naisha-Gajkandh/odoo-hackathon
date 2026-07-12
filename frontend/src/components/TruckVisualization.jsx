import React from 'react';
import toast from 'react-hot-toast';

const TruckVisualization = ({ selectedTrip }) => {
  const weight = selectedTrip ? parseFloat(selectedTrip.cargo_weight_kg) : 420.0;
  
  let maxCapacity = 2000.0;
  if (selectedTrip && selectedTrip.vehicle) {
    if (typeof selectedTrip.vehicle === 'object') {
      maxCapacity = parseFloat(selectedTrip.vehicle.max_load_capacity_kg);
    }
  }

  const capacityPercent = Math.min(Math.round((weight / maxCapacity) * 100), 100);
  const volume = (weight / 34).toFixed(1);

  const healthText = selectedTrip?.status === 'Cancelled' ? 'CHECK' : 'GOOD';
  const healthPercent = selectedTrip?.status === 'Cancelled' ? '82% Health' : '94% Health';
  const fuelRangeText = selectedTrip?.status === 'Completed' ? 'FULL' : '620 KM';
  const fuelStatusLabel = selectedTrip?.status === 'Completed' ? 'Refilled' : 'Needs Refill';
  const fuelStatusColor = selectedTrip?.status === 'Completed' ? 'text-primary' : 'text-error font-bold';

  const handleHealthClick = () => {
    toast.success('Fleet Status: Diagnostics OK. Tires: 110 PSI, Engine Temp: 92°C.', {
      icon: '⚙️',
      id: 'fleet-status'
    });
  };

  const handleFuelClick = () => {
    toast.success(`Fuel Status: ${selectedTrip?.status === 'Completed' ? '100%' : '42%'} capacity remaining. Fuel Type: Diesel.`, {
      icon: '⛽',
      id: 'fuel-status'
    });
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center bg-white border-l border-border h-full shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Truck Graphic Container */}
      <div className="w-full max-w-md relative hover:scale-102 transition-transform duration-500">
        <img 
          className="w-full opacity-90" 
          alt="Truck visualization profile" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaII216ECGC95uo0kMouMFhhDju9IA9FOebpdl_0eeBdyU1lSuTz0oSpYufLdA2HVx5e91ejnvuRwzcDiQMWAyf08N3g3iE4Xz-5x6V2YNDk14DLzzw43U2uivE70XW3nFeIRmlL-JwseLJZ_PaEEynmRJ_V2Wwgez_ijqgvhW-_4N07EPAhbhCx1qEE8dWR3hyKCSjGMwZNVFOulQa7v8vTxfOKfkbaw31QYDC16DoWazpxzKSkUm"
        />
        
        {/* Capacity Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none">
          <div className="w-[85%] h-12 bg-white/40 border border-white/60 backdrop-blur-sm rounded-2xl overflow-hidden flex items-center px-1">
            <div 
              className="h-10 bg-primary rounded-xl shadow-inner flex items-center justify-center text-white text-[10px] font-black transition-all duration-500" 
              style={{ width: `${capacityPercent}%` }}
            >
              {capacityPercent}% CAPACITY
            </div>
          </div>
          
          <div className="mt-4 flex gap-8">
            <div className="text-center">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest">Weight</span>
              <span className="text-lg font-black text-primary">{weight.toFixed(1)} kg</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest">Volume</span>
              <span className="text-lg font-black text-primary">{volume} m³</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Context Stats */}
      <div className="grid grid-cols-2 gap-4 w-full mt-12">
        <div 
          onClick={handleHealthClick}
          className="p-4 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-secondary">tire_repair</span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Fleet Status</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-sm font-black text-primary">{healthText}</span>
            <span className="text-xs text-primary font-semibold">{healthPercent}</span>
          </div>
        </div>
        
        <div 
          onClick={handleFuelClick}
          className="p-4 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-secondary">local_gas_station</span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">Fuel Range</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-sm font-black text-primary">{fuelRangeText}</span>
            <span className={`text-xs ${fuelStatusColor}`}>{fuelStatusLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckVisualization;
