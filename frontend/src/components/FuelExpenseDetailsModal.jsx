import React, { useEffect } from 'react';

const FuelExpenseDetailsModal = ({ isOpen, onClose, mode = 'receipt', data }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-xl border border-border/60 z-10 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b border-border/40 pb-4">
          <h3 className="font-headline-md text-base font-bold text-primary">
            {mode === 'receipt' ? 'Transaction Receipt' : `Expense Details: ${data.vehicleId}`}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:bg-secondary-container hover:text-primary transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {mode === 'receipt' ? (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Store / Merchant</span>
              <h4 className="font-headline-md text-base font-extrabold text-primary mt-0.5">{data.description}</h4>
              <p className="text-[10px] text-secondary mt-1">Transaction Ref: <span className="font-bold">{data.id}</span></p>
            </div>

            <div className="bg-secondary-container/20 rounded-2xl p-4 border border-border/30 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-semibold">Vehicle ID</span>
                <span className="font-bold text-primary">{data.vehicleId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-semibold">Category</span>
                <span className="font-bold text-primary uppercase">{data.category}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-semibold">Date &amp; Time</span>
                <span className="font-bold text-primary text-right" dangerouslySetInnerHTML={{ __html: data.date }} />
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-wider mb-2">Line Items</p>
              <div className="overflow-hidden rounded-xl border border-border/30 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-secondary-container/30 text-secondary font-bold">
                    <tr>
                      <th className="px-3 py-2 text-[9px] uppercase">Item</th>
                      <th className="px-3 py-2 text-[9px] uppercase">Qty</th>
                      <th className="px-3 py-2 text-[9px] uppercase text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-primary">
                    {(data.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2.5 font-semibold">{item.name}</td>
                        <td className="px-3 py-2.5">{item.qty}</td>
                        <td className="px-3 py-2.5 text-right font-bold">${item.cost?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-dashed border-border/60 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold text-primary">Total Paid</span>
              <span className="text-lg font-black text-transit-blue">${data.amount?.toFixed(2)}</span>
            </div>

            <div className="flex gap-2 pt-4">
              <button 
                onClick={() => alert('Download PDF triggered...')}
                className="flex-1 py-3 bg-secondary-container text-secondary hover:bg-secondary-container/85 font-bold rounded-xl text-xs transition-colors focus:outline-none"
              >
                Download PDF
              </button>
              <button 
                onClick={() => alert('Sending receipt to registered email...')}
                className="flex-1 py-3 bg-primary text-on-primary hover:bg-primary/95 font-bold rounded-xl text-xs active:scale-[0.98] transition-all uppercase tracking-wider focus:outline-none"
              >
                Send Copy
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-secondary-container/10 p-4.5 rounded-2xl border border-border/30">
              <div>
                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Selected Fleet</p>
                <h4 className="font-headline-md text-sm font-black text-primary mt-0.5">{data.vehicleId}</h4>
              </div>
              <span className="bg-transit-blue-container text-transit-blue px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                {data.status}
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-primary">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-secondary font-semibold">Vehicle Class</span>
                <span className="font-bold">{data.type}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-secondary font-semibold">Operational Area</span>
                <span className="font-bold">{data.zone}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-secondary font-semibold">Monthly Budget Cap</span>
                <span className="font-bold">${data.limit?.toLocaleString('en-US')}.00</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-secondary font-semibold">Fuel Spent</span>
                <span className="font-bold text-transit-blue">${data.fuelCosts?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-secondary font-semibold">Tolls &amp; Fees Spent</span>
                <span className="font-bold text-transit-blue">${data.tollsFees?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-primary pt-1">
                <span>Total Accumulated Expenses</span>
                <span>${(data.fuelCosts + data.tollsFees)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-3 bg-primary text-on-primary hover:bg-primary/95 font-bold rounded-xl text-xs active:scale-[0.98] transition-all uppercase tracking-wider focus:outline-none mt-4"
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelExpenseDetailsModal;
