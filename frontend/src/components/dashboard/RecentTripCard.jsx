import React from 'react';

/* ─── Sticker-style vehicle SVGs — fill the card box exactly ─── */

const SemiTruckSVG = () => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Trailer */}
    <rect x="8" y="16" width="82" height="50" rx="3" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5"/>
    <line x1="8" y1="34" x2="90" y2="34" stroke="#E2E8F0" strokeWidth="1.5"/>
    <line x1="50" y1="16" x2="50" y2="66" stroke="#E2E8F0" strokeWidth="1.5"/>
    <text x="16" y="50" fontSize="8" fill="#94A3B8" fontWeight="bold" fontFamily="sans-serif">TRANSIT OPS</text>
    {/* Cab body */}
    <path d="M90 22 L90 66 L152 66 L152 44 L138 22 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="2.5"/>
    {/* Cab roof box */}
    <rect x="90" y="14" width="44" height="10" rx="2" fill="#DC2626" stroke="#1E293B" strokeWidth="2"/>
    {/* Windshield */}
    <path d="M120 28 L138 28 L147 45 L120 45 Z" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Side window */}
    <rect x="96" y="30" width="20" height="13" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Door line */}
    <line x1="118" y1="22" x2="118" y2="66" stroke="#B91C1C" strokeWidth="1.5"/>
    {/* Exhaust stack */}
    <rect x="87" y="5" width="6" height="20" rx="3" fill="#475569" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Front bumper */}
    <rect x="149" y="52" width="8" height="14" rx="2" fill="#374151" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Headlight */}
    <rect x="150" y="34" width="6" height="12" rx="2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5"/>
    {/* Trailer wheels */}
    <circle cx="30" cy="72" r="13" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="30" cy="72" r="5" fill="#94A3B8"/>
    <circle cx="65" cy="72" r="13" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="65" cy="72" r="5" fill="#94A3B8"/>
    {/* Cab wheels */}
    <circle cx="112" cy="72" r="12" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="112" cy="72" r="5" fill="#94A3B8"/>
    <circle cx="136" cy="72" r="10" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="136" cy="72" r="4" fill="#94A3B8"/>
  </svg>
);

const SprinterVanSVG = () => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Body */}
    <path d="M12 20 L12 66 L150 66 L150 40 L132 20 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5"/>
    {/* Lower panel */}
    <path d="M12 52 L150 52 L150 66 L12 66 Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Windshield */}
    <path d="M118 26 L132 26 L144 45 L118 45 Z" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Side windows */}
    <rect x="80" y="26" width="34" height="20" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    <rect x="42" y="26" width="34" height="20" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Door lines */}
    <line x1="76" y1="20" x2="76" y2="66" stroke="#94A3B8" strokeWidth="2"/>
    <line x1="38" y1="20" x2="38" y2="66" stroke="#94A3B8" strokeWidth="1.5"/>
    {/* Rear handle */}
    <circle cx="24" cy="43" r="2.5" fill="#94A3B8"/>
    {/* Bumper */}
    <rect x="147" y="52" width="10" height="14" rx="2" fill="#374151" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Headlight */}
    <rect x="148" y="38" width="8" height="10" rx="2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5"/>
    {/* Fog light */}
    <rect x="148" y="50" width="5" height="4" rx="1" fill="#FED7AA" stroke="#FB923C" strokeWidth="1"/>
    {/* Wheels */}
    <circle cx="40" cy="72" r="13" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="40" cy="72" r="5" fill="#94A3B8"/>
    <circle cx="126" cy="72" r="13" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="126" cy="72" r="5" fill="#94A3B8"/>
  </svg>
);

const MotorcycleSVG = () => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Delivery cargo box */}
    <rect x="8" y="16" width="50" height="40" rx="3" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5"/>
    <line x1="33" y1="16" x2="33" y2="56" stroke="#1E293B" strokeWidth="1.5"/>
    <line x1="8" y1="36" x2="58" y2="36" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Cargo box lock */}
    <rect x="55" y="33" width="6" height="8" rx="1" fill="#1E293B"/>
    {/* Frame */}
    <path d="M58 52 L82 32 L110 32 L126 52" stroke="#292524" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
    {/* Tank */}
    <path d="M78 22 C85 14, 112 14, 114 28 L106 50 L78 50 Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="2"/>
    {/* Seat */}
    <path d="M62 44 L98 44 L96 50 L62 50 Z" fill="#1E293B"/>
    {/* Handlebar */}
    <path d="M115 28 L122 20" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M115 28 L122 36" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Front fork */}
    <path d="M118 34 L130 56" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Engine/exhaust */}
    <rect x="78" y="52" width="30" height="8" rx="2" fill="#92400E" stroke="#1E293B" strokeWidth="1.5"/>
    <path d="M100 60 L110 68" stroke="#64748B" strokeWidth="3" strokeLinecap="round"/>
    {/* Rear wheel */}
    <circle cx="55" cy="66" r="18" fill="#1E293B" stroke="#334155" strokeWidth="2.5"/>
    <circle cx="55" cy="66" r="7" fill="#475569"/>
    <circle cx="55" cy="66" r="3" fill="#94A3B8"/>
    {/* Front wheel */}
    <circle cx="130" cy="66" r="18" fill="#1E293B" stroke="#334155" strokeWidth="2.5"/>
    <circle cx="130" cy="66" r="7" fill="#475569"/>
    <circle cx="130" cy="66" r="3" fill="#94A3B8"/>
    {/* Headlight */}
    <ellipse cx="142" cy="36" rx="6" ry="8" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5"/>
  </svg>
);

const TransitVanSVG = () => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Body */}
    <path d="M10 24 L10 66 L150 66 L150 42 L130 24 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="2.5"/>
    {/* Lower panel */}
    <path d="M10 54 L150 54 L150 66 L10 66 Z" fill="#2563EB" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Windshield */}
    <path d="M116 30 L130 30 L142 48 L116 48 Z" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Side windows */}
    <rect x="78" y="30" width="34" height="18" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    <rect x="40" y="30" width="34" height="18" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Door lines */}
    <line x1="74" y1="24" x2="74" y2="66" stroke="#1D4ED8" strokeWidth="2"/>
    <line x1="36" y1="24" x2="36" y2="66" stroke="#1D4ED8" strokeWidth="1.5"/>
    {/* Rear handle */}
    <circle cx="22" cy="45" r="2.5" fill="#93C5FD"/>
    {/* Bumper */}
    <rect x="147" y="54" width="10" height="12" rx="2" fill="#374151" stroke="#1E293B" strokeWidth="1.5"/>
    {/* Headlight */}
    <rect x="148" y="40" width="8" height="10" rx="2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5"/>
    {/* Fog light */}
    <rect x="148" y="52" width="5" height="4" rx="1" fill="#FED7AA" stroke="#FB923C" strokeWidth="1"/>
    {/* Wheels */}
    <circle cx="38" cy="72" r="13" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="38" cy="72" r="5" fill="#94A3B8"/>
    <circle cx="126" cy="72" r="13" fill="#1E293B" stroke="#334155" strokeWidth="2"/>
    <circle cx="126" cy="72" r="5" fill="#94A3B8"/>
  </svg>
);

const getVehicleSticker = (vehicleName) => {
  const name = vehicleName.toLowerCase();
  if (name.includes('fh16') || name.includes('volvo')) return <SemiTruckSVG />;
  if (name.includes('sprinter'))                          return <SprinterVanSVG />;
  if (name.includes('scania') || name.includes('mini'))   return <MotorcycleSVG />;
  return <TransitVanSVG />;
};

/* ─── Status badge ─── */
const statusBadgeClass = (status) => {
  const base = 'px-3 py-0.5 rounded-full text-[10px] font-bold uppercase font-headline-md tracking-wider';
  switch (status.toLowerCase()) {
    case 'on trip':
    case 'dispatched':
      return `${base} bg-success-green-container text-on-success-green`;
    case 'completed':
      return `${base} bg-primary/5 text-primary`;
    default:
      return `${base} bg-secondary-container text-on-secondary-container`;
  }
};

/* ─── Card ─── */
const RecentTripCard = ({ trip }) => {
  const { id, status, vehicleCode, vehicleName, driver, eta } = trip;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-success-green/20 transition-all duration-300">

      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-center">
        <span className="text-[10px] font-black text-primary tracking-widest font-headline-md">{id}</span>
        <span className={statusBadgeClass(status)}>{status}</span>
      </div>

      {/* Body */}
      <div className="flex items-center">
        {/* Vehicle sticker — fills the w-36 h-24 box completely */}
        <div className="w-36 h-24 flex-shrink-0 mx-3 mb-4 group-hover:scale-105 transition-transform duration-500">
          {getVehicleSticker(vehicleName)}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between pb-4 pr-4 pt-1 min-w-0">
          <div>
            <p className="text-[10px] text-secondary uppercase font-bold leading-none mb-1 font-headline-md tracking-wider">Vehicle</p>
            <p className="text-[13px] font-bold text-primary font-headline-md truncate group-hover:text-success-green transition-colors duration-300">
              {vehicleCode} ({vehicleName})
            </p>
          </div>
          <div className="flex justify-between items-end mt-3">
            <div>
              <p className="text-[10px] text-secondary uppercase font-bold leading-none mb-0.5 font-headline-md tracking-wider">Driver</p>
              <p className="text-[12px] text-primary font-headline-md">{driver}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-secondary uppercase font-bold leading-none mb-0.5 font-headline-md tracking-wider">ETA</p>
              <p className="text-[12px] font-bold text-primary font-headline-md">{eta}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RecentTripCard;
