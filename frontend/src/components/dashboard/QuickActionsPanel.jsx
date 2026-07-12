import React from 'react';
import { toast } from 'react-hot-toast';

const QuickActionsPanel = ({ actions }) => {
  const handleActionClick = (title) => {
    toast(`${title} — coming soon!`, {
      icon: '🚀',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/40 p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
      <h4 className="font-headline-md font-bold text-[11px] text-secondary uppercase tracking-widest">
        Quick Actions
      </h4>
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => handleActionClick(action.title)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-success-green/10 hover:bg-surface-container transition-all text-left focus:outline-none focus:ring-1 focus:ring-success-green/20 active:scale-[0.98] group cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary bg-primary/5 p-2.5 rounded-xl transition-colors duration-300 group-hover:bg-success-green-container group-hover:text-success-green">
              {action.icon}
            </span>
            <div>
              <p className="text-xs font-bold font-headline-md text-primary transition-colors duration-300 group-hover:text-success-green">
                {action.title}
              </p>
              <p className="text-[10px] text-secondary font-headline-md leading-none mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
