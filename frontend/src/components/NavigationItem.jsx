import React from 'react';

const NavigationItem = ({ icon, label, isActive, isCollapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all duration-200 group focus:outline-none ${
        isActive
          ? 'bg-primary text-on-primary font-bold shadow-sm'
          : 'text-secondary hover:bg-secondary-container hover:text-primary'
      }`}
      title={isCollapsed ? label : undefined}
    >
      {/* Left indicator bar - always visible when active, styled in electric transit blue */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-transit-blue rounded-r-md" />
      )}
      
      {/* Icon */}
      <span className="material-symbols-outlined text-[20px] flex-shrink-0">
        {icon}
      </span>
      
      {/* Label (hidden in collapsed mode) */}
      <span
        className={`text-[13px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap overflow-hidden ${
          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default NavigationItem;
