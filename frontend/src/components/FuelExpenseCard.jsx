import React from 'react';

const FuelExpenseCard = ({ card, onViewDetails }) => {
  const getStatusBadge = (status) => {
    if (status?.toLowerCase() === 'over budget') {
      return (
        <span className="bg-error-container/20 px-2 py-0.5 rounded text-[10px] font-bold text-error uppercase tracking-wider">
          Over Budget
        </span>
      );
    }
    if (status?.toLowerCase() === 'standby') {
      return (
        <span className="bg-secondary-container px-2 py-0.5 rounded text-[10px] font-bold text-secondary uppercase tracking-wider">
          Standby
        </span>
      );
    }
    return (
      <span className="bg-secondary-container px-2 py-0.5 rounded text-[10px] font-bold text-on-secondary-container uppercase tracking-wider">
        Active
      </span>
    );
  };

  const isOverBudget = card.status?.toLowerCase() === 'over budget' || card.usagePercentage >= 90;
  const progressBg = isOverBudget ? 'bg-error' : 'bg-primary';

  return (
    <div className="bg-white rounded-2xl p-6 soft-shadow border border-border/40 flex flex-col gap-6 group hover:border-primary/50 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">{card.icon || 'local_shipping'}</span>
          </div>
          <div>
            <h3 className="font-title-sm text-sm font-bold text-primary">{card.vehicleId}</h3>
            <p className="text-[11px] text-secondary">{card.type} &bull; {card.zone}</p>
          </div>
        </div>
        {getStatusBadge(card.status)}
      </div>

      {/* Budget Gauge */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-secondary">Monthly Budget Usage</span>
          <span className={`font-headline-md text-base font-bold ${isOverBudget ? 'text-error' : 'text-primary'}`}>
            {card.usagePercentage}%
          </span>
        </div>
        <div className="h-2.5 w-full bg-secondary-container rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBg}`} 
            style={{ width: `${card.usagePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[9px] text-secondary font-bold">
          <span>₹0.00</span>
          <span>₹{card.limit?.toLocaleString('en-US')}.00 Limit</span>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Fuel Costs</p>
          <p className="font-title-sm text-xs font-bold text-primary">₹{card.fuelCosts?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-secondary uppercase tracking-wider">Tolls & Fees</p>
          <p className="font-title-sm text-xs font-bold text-primary">₹{card.tollsFees?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-2 mt-auto pt-4">
        <button 
          onClick={() => onViewDetails(card)}
          className="flex-1 py-2 text-primary text-xs font-bold border border-border rounded-lg hover:bg-secondary-container/40 transition-colors focus:outline-none"
        >
          View Details
        </button>
        <button 
          onClick={() => alert('Quick Actions menu coming soon!')}
          className="p-2 text-secondary hover:bg-secondary-container hover:text-primary rounded-lg focus:outline-none"
        >
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </div>
    </div>
  );
};

export default FuelExpenseCard;
