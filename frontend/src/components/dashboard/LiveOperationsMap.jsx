import React from 'react';
import { Gauge, Route, ShieldCheck, Search } from 'lucide-react';

const LiveOperationsMap = ({ metrics, mapSearch, setMapSearch }) => {
  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md font-black text-[20px] text-primary leading-tight">
          Live Operations Map
        </h3>
        <div className="flex gap-2">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-border/30 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase font-headline-md tracking-wider">
              System Operational
            </span>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="bg-white rounded-3xl shadow-sm border border-border/40 h-[400px] overflow-hidden relative group hover:shadow-md transition-all duration-300">
        {/* Background map image */}
        <div className="w-full h-full grayscale-[0.5] opacity-85 contrast-[1.03] transition-all duration-700 group-hover:scale-101">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${metrics.mapImage}')` }}
          />
        </div>

        {/* Overlay stats card */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-3">
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-md border border-border/30 min-w-[220px] space-y-3">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider font-headline-md">
              Real-time Metrics
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-headline-md text-secondary flex items-center gap-2">
                  <Gauge size={14} className="text-primary" />
                  Avg Speed
                </span>
                <span className="text-xs font-bold text-primary font-headline-md">
                  {metrics.avgFleetSpeed}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-headline-md text-secondary flex items-center gap-2">
                  <Route size={14} className="text-primary" />
                  Active Routes
                </span>
                <span className="text-xs font-bold text-primary font-headline-md">
                  {metrics.activeRoutes}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-headline-md text-secondary flex items-center gap-2">
                  <ShieldCheck size={14} className="text-success-green" />
                  Alert Status
                </span>
                <span className="text-[10px] font-black text-success-green font-headline-md tracking-wider">
                  {metrics.alertStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating search */}
        <div className="absolute top-6 right-6">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-border/30 flex items-center gap-2 focus-within:ring-2 focus-within:ring-success-green/20 focus-within:border-success-green transition-all duration-300">
            <Search size={14} className="text-secondary" />
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs w-40 font-headline-md text-primary placeholder:text-secondary"
              placeholder="Locate vehicle..."
              type="text"
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveOperationsMap;
