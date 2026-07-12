import React from 'react';

const TripCard = ({ trip, isSelected, onClick }) => {
  const { id, trip_code, source, destination, status, cargo_weight_kg, vehicle, driver } = trip;
  
  const cargoText = `Cargo (${cargo_weight_kg} kg)`;
  const vehicleReg = vehicle ? (typeof vehicle === 'object' ? vehicle.registration_number : `#VEH-${vehicle}`) : 'Unassigned';
  const etaText = trip.eta || "14:30 PM";

  const getCardStyle = () => {
    let classes = "p-4 rounded-2xl flex gap-4 cursor-pointer border transition-all duration-200 relative overflow-hidden ";
    
    if (isSelected) {
      if (status === 'Draft') {
        classes += "bg-white border-primary border-2 shadow-md ";
      } else if (status === 'Completed') {
        classes += "bg-white border-success-green border-2 shadow-md ";
      } else if (status === 'Cancelled') {
        classes += "bg-white border-error border-2 shadow-md ";
      } else {
        // Dispatched or In-Transit
        classes += "bg-white border-transit-blue border-2 shadow-md ";
      }
    } else {
      if (status === 'Draft') {
        classes += "bg-surface border-border hover:border-transit-blue shadow-sm ";
      } else if (status === 'Completed') {
        classes += "bg-success-green-container/20 border-success-green/30 hover:border-success-green shadow-sm ";
      } else if (status === 'Cancelled') {
        classes += "bg-error-container/10 border-error/20 hover:border-error shadow-sm ";
      } else {
        // Dispatched or In-Transit (Active)
        classes += "bg-white border-border hover:border-transit-blue shadow-sm ";
      }
    }
    
    classes += " hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md";
    return classes;
  };

  const renderLeftIndicator = () => {
    if (status === 'Draft') {
      return (
        <div className="flex flex-col items-center gap-1 w-4">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white"></div>
          <div className="flex-1 w-[1px] dashed-line my-1"></div>
          <div className="w-2.5 h-2.5 rounded-full border border-border bg-white"></div>
        </div>
      );
    }
    
    if (status === 'Completed') {
      return (
        <div className="flex flex-col items-center gap-1 w-4">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
          <div className="flex-1 w-[1px] bg-secondary/35 my-1"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
        </div>
      );
    }

    if (status === 'Cancelled') {
      return (
        <div className="flex flex-col items-center gap-1 w-4">
          <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
          <div className="flex-1 w-[1px] bg-error/35 my-1"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
        </div>
      );
    }
    
    // Dispatched or In-Transit (Active) - Glowing Blue Line
    return (
      <div className="flex flex-col items-center gap-1 w-4">
        <div className="w-2.5 h-2.5 rounded-full bg-transit-blue border border-transit-blue"></div>
        <div className="flex-1 w-[1px] dashed-line my-1 opacity-70"></div>
        <div className="w-2.5 h-2.5 rounded-full border border-transit-blue bg-white"></div>
        <div className="flex-1 w-[1px] dashed-line my-1 opacity-30"></div>
        <div className="w-2.5 h-2.5 rounded-full border border-border bg-white opacity-50"></div>
      </div>
    );
  };

  const getStatusLabel = () => {
    if (status === 'Draft') return 'Draft Trip';
    if (status === 'Completed') return 'Completed';
    if (status === 'Cancelled') return 'Cancelled';
    if (status === 'In-Transit') return 'In Transit';
    return 'Active Dispatch'; // Dispatched
  };

  const getStatusClasses = () => {
    if (status === 'Completed') return 'text-secondary';
    if (status === 'Cancelled') return 'text-error';
    if (status === 'Dispatched' || status === 'In-Transit') return 'text-transit-blue font-bold';
    return 'text-secondary';
  };

  return (
    <div className={getCardStyle()} onClick={onClick}>
      {/* Top Right Tag (Vehicle Reg or ID) */}
      {(status === 'Dispatched' || status === 'In-Transit') && (
        <div className="absolute top-0 right-0 p-2">
          <span className="text-[10px] font-bold bg-transit-blue text-on-primary px-2 py-0.5 rounded-md">
            {vehicleReg}
          </span>
        </div>
      )}
      {status === 'Completed' && (
        <div className="absolute top-0 right-0 p-2">
          <span className="text-[10px] font-bold bg-secondary text-white px-2 py-0.5 rounded-md">
            {vehicleReg}
          </span>
        </div>
      )}
      
      {renderLeftIndicator()}

      <div className="flex-1 min-w-0 pr-6">
        <div className={`text-[11px] font-bold mb-1 uppercase tracking-tight ${getStatusClasses()}`}>
          {getStatusLabel()}
        </div>
        <div className="text-sm font-bold text-primary truncate leading-snug">{source}</div>
        <div className="text-sm text-secondary truncate mt-0.5">{destination}</div>
        
        {status !== 'Completed' && status !== 'Cancelled' ? (
          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-secondary uppercase font-bold tracking-wide">Cargo</p>
              <p className="text-xs font-bold text-primary truncate max-w-[150px] mt-0.5">{cargoText}</p>
            </div>
            {(status === 'Dispatched' || status === 'In-Transit') && (
              <div className="text-right">
                <p className="text-[10px] text-secondary uppercase font-bold tracking-wide">ETA</p>
                <p className="text-xs font-bold text-transit-blue mt-0.5">{etaText}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wide bg-secondary-container text-on-secondary-container`}>
              ID: {trip_code}
            </span>
          </div>
        )}
      </div>

      {/* Context menu icon on Draft Card */}
      {status === 'Draft' && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            alert('Draft actions menu triggered.');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-secondary hover:text-primary rounded-xl hover:bg-secondary-container transition-all focus:outline-none"
          title="Actions"
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      )}
    </div>
  );
};

export default TripCard;
