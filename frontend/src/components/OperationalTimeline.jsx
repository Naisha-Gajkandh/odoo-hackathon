import React from 'react';

const OperationalTimeline = ({ selectedTrip }) => {
  if (!selectedTrip) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mt-8 transition-all duration-200">
        <h3 className="text-[18px] font-black text-primary mb-4 font-headline-md">Operational Timeline</h3>
        <p className="text-xs text-secondary italic">Select a trip to view its operations log timeline.</p>
      </div>
    );
  }

  // Generate dynamic logs based on the trip's state
  const getTimelineEvents = () => {
    const events = [];
    const tripCode = selectedTrip.trip_code;
    const vehicleReg = selectedTrip.vehicle 
      ? (typeof selectedTrip.vehicle === 'object' ? selectedTrip.vehicle.registration_number : `VH-${selectedTrip.vehicle}`) 
      : 'Unassigned';
    const driverName = selectedTrip.driver 
      ? (typeof selectedTrip.driver === 'object' ? selectedTrip.driver.name : `Driver #${selectedTrip.driver}`) 
      : 'Unassigned';
    const cargoWeight = selectedTrip.cargo_weight_kg;

    // Time mock helper
    const createdTime = new Date(selectedTrip.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTime = new Date(selectedTrip.updated_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: Draft
    events.push({
      title: `Trip ${tripCode} Initialized`,
      time: createdTime,
      desc: `Hub Chicago assigned ${cargoWeight} kg of cargo for priority delivery to ${selectedTrip.destination}.`,
      active: true,
    });

    // Step 2: Dispatched
    if (selectedTrip.status === 'Dispatched' || selectedTrip.status === 'In-Transit' || selectedTrip.status === 'Completed') {
      events.unshift({
        title: 'Driver Check-in Complete',
        time: updatedTime,
        desc: `${driverName} completed pre-trip safety checklist for vehicle ${vehicleReg}.`,
        active: true,
      });
    }

    // Step 3: Transit / Completion / Cancellation
    if (selectedTrip.status === 'Completed') {
      events.unshift({
        title: 'Delivery Complete',
        time: updatedTime,
        desc: `Arrival confirmed at ${selectedTrip.destination}. Final odometer: ${selectedTrip.final_odometer || 0} km. Fuel: ${selectedTrip.fuel_consumed_liters || 0} L.`,
        active: true,
      });
    } else if (selectedTrip.status === 'Cancelled') {
      events.unshift({
        title: 'Trip Cancelled',
        time: updatedTime,
        desc: `Trip aborted by dispatcher. Driver ${driverName} and Vehicle ${vehicleReg} released.`,
        active: false,
      });
    }

    return events;
  };

  const events = getTimelineEvents();

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mt-8 hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
      <h3 className="text-[18px] font-black text-primary mb-6 font-headline-md">
        Operational Timeline
      </h3>
      
      <div className="relative pl-6 space-y-6">
        {events.map((event, idx) => {
          const isLast = idx === events.length - 1;
          
          return (
            <div key={idx} className="relative flex gap-4">
              
              {/* Timeline dot and connecting line */}
              <div className="absolute left-[-24px] top-1.5 flex flex-col items-center h-full">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  event.active ? 'bg-primary' : 'bg-outline-variant'
                }`} />
                {!isLast && (
                  <div className="w-[1px] bg-border flex-grow my-1 h-full min-h-[40px]" />
                )}
              </div>
              
              {/* Timeline Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-primary">{event.title}</h4>
                  <span className="text-[11px] text-secondary font-semibold ml-2 flex-shrink-0">{event.time}</span>
                </div>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  {event.desc}
                </p>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperationalTimeline;
