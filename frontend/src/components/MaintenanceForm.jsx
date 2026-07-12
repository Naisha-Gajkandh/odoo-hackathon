import React, { useState } from 'react';
import toast from 'react-hot-toast';

const MaintenanceForm = ({ onSubmit }) => {
  const [vehicleId, setVehicleId] = useState('VAN-05');
  const [serviceType, setServiceType] = useState('Oil Change');
  const [cost, setCost] = useState('2500');
  const [date, setDate] = useState('07/07/2026');
  const [status, setStatus] = useState('Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleId || !serviceType || !cost || !date) {
      toast.error('Please fill in all fields.');
      return;
    }

    const numericCost = parseFloat(cost);
    if (isNaN(numericCost) || numericCost < 0) {
      toast.error('Please enter a valid cost.');
      return;
    }

    onSubmit({
      vehicleId,
      serviceType,
      cost: numericCost,
      date,
      status: status || 'Active'
    });

    // Reset Form (or keep default template values)
    setVehicleId('VAN-05');
    setServiceType('Oil Change');
    setCost('2500');
    setDate(new Date().toLocaleDateString('en-GB'));
    setStatus('Active');
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-border/60 soft-shadow hover:shadow-md transition-all duration-300">
      <h3 className="font-headline-md text-base font-bold text-primary mb-4 uppercase tracking-tight">Log Service Record</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Vehicle</label>
            <input 
              className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
              type="text" 
              value={vehicleId} 
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="e.g. VAN-05"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Service Type</label>
            <input 
              className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
              type="text" 
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. Oil Change"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Cost ($)</label>
            <input 
              className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
              type="number" 
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g. 2500"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Date</label>
            <input 
              className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
              type="text" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Status</label>
            <input 
              className="w-full px-4 py-2.5 bg-secondary-container/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary text-xs font-semibold"
              type="text" 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="e.g. Active, Completed"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-3.5 bg-primary text-on-primary font-bold rounded-xl text-xs hover:bg-primary/90 active:scale-[0.98] transition-all uppercase tracking-widest shadow-sm focus:outline-none mt-2"
        >
          Save Record
        </button>
      </form>
    </div>
  );
};

export default MaintenanceForm;
