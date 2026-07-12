import React, { useState } from 'react';

const Timeline = ({ events = [] }) => {
  // Store expanded item IDs in state
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDotColorClass = (type) => {
    switch (type) {
      case 'success':
      case 'positive':
        return 'bg-success-green ring-white';
      case 'warning':
        return 'bg-warning-orange ring-white';
      case 'error':
        return 'bg-error ring-white';
      case 'info':
      default:
        return 'bg-transit-blue ring-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-sm text-primary">Safety &amp; Incident Timeline</h3>
        <button 
          onClick={() => alert('Detailed Safety Report generation coming soon.')}
          className="text-transit-blue hover:text-on-transit-blue text-xs font-bold hover:underline focus:outline-none"
        >
          View Detailed Report
        </button>
      </div>
      
      {events.length > 0 ? (
        <div className="relative pl-8 border-l-2 border-border space-y-6 pb-2">
          {events.map((event) => {
            const isExpanded = expandedItems[event.id];
            
            return (
              <div key={event.id} className="relative group">
                {/* Timeline Milestone Dot */}
                <div
                  className={`absolute -left-[41px] top-1.5 w-4 h-4 rounded-full ring-4 shadow-sm transition-transform duration-200 group-hover:scale-125 ${getDotColorClass(
                    event.type
                  )}`}
                />
                
                <div 
                  onClick={() => toggleExpand(event.id)}
                  className="flex justify-between items-start gap-4 cursor-pointer p-2.5 rounded-xl hover:bg-background transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-primary truncate group-hover:text-transit-blue transition-colors">
                        {event.title}
                      </p>
                      <span className="material-symbols-outlined text-secondary text-base select-none">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                    
                    {/* Collapsible content */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[200px] mt-2 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-xs text-secondary leading-relaxed bg-white border border-border/50 rounded-lg p-2.5 shadow-inner">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-[11px] font-bold text-secondary flex-shrink-0 mt-0.5">
                    {event.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-secondary text-xs italic">
          No recent incidents or events logged.
        </div>
      )}
    </div>
  );
};

export default Timeline;
