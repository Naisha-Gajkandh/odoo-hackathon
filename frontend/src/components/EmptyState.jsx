import React from 'react';

const EmptyState = ({
  title = "No Results Found",
  message = "We couldn't find any vehicles or records matching your active criteria. Try clearing your search query or adjusting your filters.",
  onReset
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-border rounded-2xl soft-shadow select-none animate-fade-in my-6">
      <div className="w-20 h-20 bg-secondary-container/50 text-secondary rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 0" }}>
          search_off
        </span>
      </div>

      {/* Title — Manrope Black, matches other card headings */}
      <h3 className="font-headline-md text-headline-md text-primary font-black mb-2">
        {title}
      </h3>

      {/* Body message — Manrope, 13px, secondary colour */}
      <p className="font-headline-md text-[13px] font-bold text-secondary max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="font-headline-md flex items-center gap-2 bg-primary text-on-primary font-bold px-5 py-2.5 rounded-xl text-[12px] hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm focus:outline-none"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          Reset Filters &amp; Search
        </button>
      )}
    </div>
  );
};

export default EmptyState;
