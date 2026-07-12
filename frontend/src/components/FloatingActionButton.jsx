import React from 'react';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="absolute bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30 group border-none focus:outline-none"
      title="Manual Dispatch"
    >
      <span className="material-symbols-outlined text-[24px]">add</span>
      <span className="absolute right-full mr-4 bg-primary text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity font-bold pointer-events-none shadow-md">
        Manual Dispatch
      </span>
    </button>
  );
};

export default FloatingActionButton;
