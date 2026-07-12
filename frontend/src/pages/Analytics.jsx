import React, { useState, useEffect } from 'react';
import { mockAnalyticsData } from '../services/mockAnalyticsData';
import AnalyticsHeader from '../components/AnalyticsHeader';
import AnalyticsFilters from '../components/AnalyticsFilters';
import KPICard from '../components/KPICard';
import PerformanceChart from '../components/PerformanceChart';
import CostChart from '../components/CostChart';
import FuelChart from '../components/FuelChart';
import FleetChart from '../components/FleetChart';
import SummaryCard from '../components/SummaryCard';
import AnalyticsTable from '../components/AnalyticsTable';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Analytics = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('Overview'); // Overview, Financials, FuelEfficiency, FleetPerformance
  const [dateRange, setDateRange] = useState('This Month');
  const [startDate, setStartDate] = useState('2024-06-01');
  const [endDate, setEndDate] = useState('2024-06-30');
  
  // Interactive Map State
  const [activeHub, setActiveHub] = useState('Chicago');

  // Trigger loading state briefly when report parameters change to simulate data fetching
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [reportType, dateRange]);

  // Fetch KPI data based on Date Range
  const getActiveKpis = () => {
    return mockAnalyticsData.kpis[dateRange] || mockAnalyticsData.kpis['This Month'];
  };

  // Find active hub details for the Map Panel
  const getActiveHubDetails = () => {
    return (
      mockAnalyticsData.mapHubs.find((hub) => hub.name === activeHub) ||
      mockAnalyticsData.mapHubs[0]
    );
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setReportType('Overview');
    setDateRange('This Month');
    setActiveHub('Chicago');
  };

  if (loading) {
    return (
      <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8">
        <LoadingSkeleton />
      </section>
    );
  }

  const activeHubDetails = getActiveHubDetails();

  return (
    <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto pb-12">
        
        {/* Dynamic Analytics Header with Title and CSV Export */}
        <AnalyticsHeader reportType={reportType} dateRange={dateRange} />

        {/* Tab & Date Filters Panel */}
        <AnalyticsFilters
          reportType={reportType}
          setReportType={setReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* Bento KPI Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getActiveKpis().map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Dynamic Main Body Content based on active Report Type */}
        {reportType === 'Overview' && (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Growth Curve (Line/Area) */}
              <PerformanceChart data={mockAnalyticsData.revenueGrowth} />

              {/* Cost Breakdown Progress Bars List */}
              <CostChart
                data={mockAnalyticsData.costBreakdown}
                searchQuery={searchQuery}
                onViewAll={() => setReportType('Financials')}
              />
            </div>

            {/* Lower Section: Interactive Hub Map & Fleet Capacity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Map Visualization Card */}
              <div className="bg-white rounded-xl border border-border soft-shadow overflow-hidden relative min-h-[400px] select-none hover:scale-[1.005] transition-transform duration-300">
                {/* Floating Hub Counts */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <div className="bg-white p-3 rounded-xl border border-border flex flex-col gap-1 shadow-sm">
                    <span className="text-secondary font-bold uppercase text-[9px] tracking-wider leading-none">
                      Active Hubs
                    </span>
                    <span className="font-headline-md text-headline-md text-transit-blue font-black text-xl leading-none">
                      12
                    </span>
                  </div>
                </div>

                {/* City Interactive Marker Dots overlaying the Map Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    className="w-full h-full object-cover grayscale opacity-60 pointer-events-none"
                    alt="Map base grid"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHWyhKcVFS73Aat-PdZZYj35hsl_7CMJ2jAJ1iaAB56aBf9fBMSq6c_HPjO5iHoqWDTaEH_YBFgoDAM3Hv8T9FeBixnGvcrFS856V3sx-_3fb1zt5hC_yNc6Psus28UmwNFv44YSpy1X63SXD4V9jn4mmLAEzlke18lHskAXOA9komYnNIfA9-kEIwu7lOSDtGJDeLkt1t7JhfrNv_vjvtYpAnqA74Xl-TJQXvdLG1FXBxT3UT2SDi"
                  />
                  
                  {/* Render Markers for City Hubs */}
                  {mockAnalyticsData.mapHubs.map((hub) => {
                    const isActive = hub.name === activeHub;
                    return (
                      <button
                        key={hub.name}
                        onClick={() => setActiveHub(hub.name)}
                        className="absolute w-7 h-7 -ml-3.5 -mt-3.5 flex items-center justify-center cursor-pointer group focus:outline-none"
                        style={{ left: hub.x, top: hub.y }}
                        title={`Hub: ${hub.name}`}
                      >
                        <span className={`absolute inline-flex h-full w-full rounded-full bg-transit-blue opacity-30 group-hover:scale-125 transition-transform duration-300 ${
                          isActive ? 'animate-ping' : ''
                        }`}></span>
                        <span className={`relative rounded-full h-3.5 w-3.5 border-2 border-white transition-all duration-300 ${
                          isActive ? 'bg-transit-blue scale-110' : 'bg-secondary group-hover:bg-transit-blue'
                        }`}></span>
                        
                        {/* Tooltip Label */}
                        <span className="absolute bottom-6 bg-primary text-on-primary text-[10px] font-bold py-1 px-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          {hub.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Floating Map Current Transit Details Info Card */}
                <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl border border-border w-64 flex flex-col gap-3.5 shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between border-b border-border pb-2 select-none">
                    <span className="font-headline-md text-sm font-black text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-transit-blue">location_on</span>
                      {activeHubDetails.name} Hub
                    </span>
                    <span className="text-[10px] bg-transit-blue-container text-transit-blue font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-primary">
                    <div>
                      <p className="text-[9px] text-secondary uppercase tracking-wider mb-0.5">Temp Sensor</p>
                      <p className="flex items-center gap-1">
                        {activeHubDetails.temp}{' '}
                        <span className="text-success-green font-bold text-[10px] bg-success-green-container px-1 rounded">
                          {activeHubDetails.tempStatus}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-secondary uppercase tracking-wider mb-0.5">Avg Speed</p>
                      <p>{activeHubDetails.avgSpeed}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-secondary uppercase tracking-wider mb-0.5">Transit Score</p>
                      <p className="text-transit-blue font-black">{activeHubDetails.score}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-secondary uppercase tracking-wider mb-0.5">Departures</p>
                      <p>{activeHubDetails.shipments} Trips</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fleet Capacity Visualization */}
              <div className="bg-white p-6 md:p-8 rounded-xl border border-border soft-shadow flex flex-col gap-6 select-none hover:scale-[1.005] transition-transform duration-300">
                <h3 className="font-headline-md text-headline-md text-primary font-black">
                  Fleet Capacity Utilization
                </h3>
                <div className="flex-1 flex flex-col justify-around gap-8">
                  {mockAnalyticsData.fleetCapacity.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-6">
                      
                      {/* Vehicle image container with capacity height overlay */}
                      <div className="relative w-44 h-24 bg-secondary-container/30 border border-border/50 rounded-xl overflow-hidden flex-shrink-0">
                        {/* Vector graphic outline */}
                        <img 
                          className="w-full h-full object-contain opacity-20 p-2" 
                          alt={item.title} 
                          src={item.imgSrc} 
                        />
                        {/* Expanding capacity overlay fill */}
                        <div 
                          className={`absolute bottom-0 left-0 right-0 border-t-2 transition-all duration-1000 flex items-center justify-center ${item.fillBg}`}
                          style={{ height: `${item.fill}%` }}
                        >
                          <span className={`font-black text-xl tracking-tight ${item.fillColor}`}>
                            {item.fill}%
                          </span>
                        </div>
                      </div>

                      {/* Detail text */}
                      <div className="flex flex-col">
                        <h4 className="font-headline-md text-sm font-black text-primary">
                          {item.title}
                        </h4>
                        <p className="text-secondary text-xs mt-1 leading-normal">
                          {item.description}
                        </p>
                        <div className="mt-2.5">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                            item.status === 'Optimal' 
                              ? 'bg-success-green-container text-on-success-green' 
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Optimal' ? 'bg-success-green animate-pulse' : 'bg-outline'
                            }`}></span>
                            {item.status}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {reportType === 'Financials' && (
          <div className="flex flex-col gap-8">
            <SummaryCard reportType={reportType} dateRange={dateRange} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cost bar trends details */}
              <div className="lg:col-span-2">
                <AnalyticsTable 
                  reportType={reportType} 
                  data={mockAnalyticsData.tables.Financials} 
                  searchQuery={searchQuery}
                  onReset={handleResetFilters}
                />
              </div>
              <CostChart
                data={mockAnalyticsData.costBreakdown}
                searchQuery={searchQuery}
                onViewAll={() => setReportType('Financials')}
              />
            </div>
          </div>
        )}

        {reportType === 'FuelEfficiency' && (
          <div className="flex flex-col gap-8">
            <SummaryCard reportType={reportType} dateRange={dateRange} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FuelChart data={mockAnalyticsData.fuelTrends} />
              </div>
              <div>
                <AnalyticsTable 
                  reportType={reportType} 
                  data={mockAnalyticsData.tables.FuelEfficiency} 
                  searchQuery={searchQuery}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          </div>
        )}

        {reportType === 'FleetPerformance' && (
          <div className="flex flex-col gap-8">
            <SummaryCard reportType={reportType} dateRange={dateRange} />
            <div className="grid grid-cols-1 max-w-[1000px]">
              <FleetChart data={mockAnalyticsData.utilizationTrend} />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Analytics;
