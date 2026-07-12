import React from 'react';

const SearchBar = ({ value, onChange, placeholder = "Search trips, vehicles, or drivers..." }) => {
  return (
    <div className="relative w-full max-w-md flex items-center bg-white border border-border rounded-xl px-4 py-2.5 transition-all duration-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
      <span className="material-symbols-outlined text-secondary text-[20px] mr-2.5 pointer-events-none select-none">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none p-0 text-sm text-primary focus:ring-0 focus:outline-none placeholder-secondary/70"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-secondary hover:text-primary transition-colors focus:outline-none"
          title="Clear search"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
