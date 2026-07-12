import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ExportActions = ({ reportType = 'Overview', dateRange = 'This Month' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      toast.success(`${reportType} CSV report for ${dateRange} exported successfully!`, {
        icon: '📊',
        duration: 3000,
        style: {
          border: '1px solid #10B981',
          padding: '12px 16px',
          color: '#047857',
          fontWeight: 'bold',
          fontFamily: 'Manrope, sans-serif',
          borderRadius: '12px',
        }
      });
    }, 1000);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="font-headline-md flex items-center gap-2 bg-white border border-border text-secondary hover:text-primary hover:bg-secondary-container rounded-xl text-[12px] font-bold px-4 py-2.5 transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer shadow-sm select-none"
    >
      {isExporting ? (
        <>
          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>CSV Export</span>
        </>
      )}
    </button>
  );
};

export default ExportActions;
