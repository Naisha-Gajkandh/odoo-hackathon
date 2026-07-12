import React from 'react';

export const VehicleStatusCard = ({ log }) => {
  if (!log) return null;

  const integrity = log.engineIntegrity ?? 100;
  
  // Dynamic color selection based on status/integrity
  let progressColor = 'bg-success-green';
  let textColor = 'text-on-success-green';
  let labelText = 'Optimal';

  if (integrity < 50) {
    progressColor = 'bg-error';
    textColor = 'text-error';
    labelText = 'Critical';
  } else if (integrity < 80) {
    progressColor = 'bg-warning-orange';
    textColor = 'text-on-warning-orange';
    labelText = 'Warning';
  }

  return (
    <div className="bg-white rounded-3xl p-6 relative overflow-hidden border border-border/60 soft-shadow hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 w-full">
          <h3 className="font-headline-md text-base font-bold text-primary mb-4">Vehicle Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-secondary font-semibold">Engine Integrity</span>
                <span className={`${textColor} text-xs font-bold`}>
                  {integrity}% ({labelText})
                </span>
              </div>
              <div className="w-full bg-secondary-container h-2 rounded-full overflow-hidden">
                <div 
                  className={`${progressColor} h-full rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${integrity}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <span className="text-xs text-secondary font-semibold">Last Service</span>
              <span className="text-xs text-primary font-bold">{log.lastService}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary font-semibold">Total Mileage</span>
              <span className="text-xs text-primary font-bold">{log.totalMileage}</span>
            </div>
          </div>
        </div>

        {/* Truck Illustration */}
        <div className="w-full md:w-[50%] flex justify-center relative select-none">
          <div className="relative max-w-[280px]">
            <img 
              alt="Truck View" 
              className="w-full filter drop-shadow-lg opacity-90 transition-transform duration-500 hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGGN5WxRsUOGTnUMongAgh4Hp4SwN42At1TlB_Ne8u4QnyFGMSGVbGAFMuBsQq9jH6GdtvYz76fNdOU4ZIzx86iFZI1X-fZJS1ts33h4ffRw8bhv6GklImNoXBb3BDBrsEDtftJgwxNBC09_qwLRigKVyj1Lej1Dv-UloHB0N8Y4E5LsMaEU78hPfVEozpFLUo_mI56ekkE22u2ihlz28ktUl06DRurwWI0tzsDiJiVGPSrNlOhAcV"
            />
            {log.status?.toUpperCase() !== 'SCHEDULED' && (
              <div className="absolute top-[20%] left-[25%] w-[60%] h-[35%] bg-primary/10 backdrop-blur-[2px] flex items-center justify-center rounded-sm border border-primary/20 animate-pulse">
                <span className="text-primary font-black text-lg tracking-wider">ENGINE FIX</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EstimatedCompletionCard = ({ log, onAdjustClick }) => {
  if (!log) return null;

  const percentage = log.completionPercentage ?? 0;
  
  // Calculate SVG stroke offset for radius = 48
  // circumference = 2 * PI * r = 2 * 3.14159 * 48 = 301.59
  const radius = 48;
  const strokeDasharray = 301.6;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="bg-white p-6 rounded-3xl border border-border/60 soft-shadow hover:shadow-md transition-all duration-300">
      <h4 className="font-title-sm text-sm font-bold text-primary mb-4">Estimated Completion</h4>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0 select-none">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle 
              className="text-secondary-container" 
              cx="48" 
              cy="48" 
              fill="transparent" 
              r={radius} 
              stroke="currentColor" 
              strokeWidth="6"
            ></circle>
            {/* Active progress circle */}
            <circle 
              className="text-transit-blue transition-all duration-1000 ease-out" 
              cx="48" 
              cy="48" 
              fill="transparent" 
              r={radius} 
              stroke="currentColor" 
              strokeDasharray={strokeDasharray} 
              strokeDashoffset={strokeDashoffset} 
              strokeWidth="6"
            ></circle>
          </svg>
          <span className="absolute font-headline-md text-sm font-bold text-primary">{percentage}%</span>
        </div>
        
        <div className="flex-1">
          <p className="text-xs font-bold text-primary">Target: {log.targetCompletion}</p>
          <p className="text-[11px] text-secondary mt-1 max-w-md leading-relaxed">{log.completionNotes}</p>
          
          <button 
            onClick={onAdjustClick}
            className="mt-3 text-transit-blue font-bold text-xs flex items-center gap-1.5 hover:underline focus:outline-none transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit_calendar</span> 
            Adjust Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
