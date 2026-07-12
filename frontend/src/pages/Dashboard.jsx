import React, { useState, useEffect } from 'react';
import { mockDashboardData } from '../services/mockDashboardData';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import DashboardKPICard from '../components/dashboard/DashboardKPICard';
import RecentTripCard from '../components/dashboard/RecentTripCard';
import VehicleStatusPanel from '../components/dashboard/VehicleStatusPanel';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';
import LiveOperationsMap from '../components/dashboard/LiveOperationsMap';

const Dashboard = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);

  // Filter state
  const [vehicleType, setVehicleType] = useState('Vehicle Type: All');
  const [status, setStatus] = useState('Status: All');
  const [region, setRegion] = useState('Region: All');

  // Map search state
  const [mapSearch, setMapSearch] = useState('');

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleResetFilters = () => {
    setVehicleType('Vehicle Type: All');
    setStatus('Status: All');
    setRegion('Region: All');
    setMapSearch('');
  };

  // Advanced client-side trip filtering
  const filteredTrips = mockDashboardData.recentTrips.filter((trip) => {
    // 1. Search Query filter (matches ID, driver name, vehicle name or code)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        trip.id.toLowerCase().includes(q) ||
        trip.driver.toLowerCase().includes(q) ||
        trip.vehicleCode.toLowerCase().includes(q) ||
        trip.vehicleName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 2. Vehicle Type filter
    if (vehicleType !== 'Vehicle Type: All') {
      const name = (trip.vehicleCode + ' ' + trip.vehicleName).toLowerCase();
      if (vehicleType === 'Trucks') {
        if (!name.includes('volvo') && !name.includes('scania')) return false;
      } else if (vehicleType === 'Vans') {
        if (!name.includes('sprinter') && !name.includes('transit') && !name.includes('ford')) return false;
      } else if (vehicleType === 'Motorcycles') {
        if (!name.includes('mini') && !trip.imageAlt.toLowerCase().includes('motorcycle')) return false;
      }
    }

    // 3. Status filter
    if (status !== 'Status: All') {
      const s = status.toLowerCase();
      if (s === 'active') {
        if (trip.status !== 'On Trip' && trip.status !== 'Dispatched') return false;
      } else if (s === 'available') {
        if (trip.status !== 'Completed') return false;
      } else if (s === 'in maintenance') {
        if (trip.status !== 'In Shop' && trip.status !== 'Maintenance') return false;
      } else if (s === 'retired') {
        if (trip.status !== 'Retired') return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8">
        <LoadingSkeleton />
      </section>
    );
  }

  return (
    <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col gap-8 w-full max-w-[1600px] pb-12 space-y-0">

        {/* ── Filters ── */}
        <DashboardFilters
          filters={mockDashboardData.filters}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
          status={status}
          setStatus={setStatus}
          region={region}
          setRegion={setRegion}
        />

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {mockDashboardData.kpis.map((kpi) => (
            <DashboardKPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* ── Main Content Grid: Trips (8 cols) + Sidebar (4 cols) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Trips */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md font-black text-[20px] text-primary leading-tight">
                Recent Trips
              </h3>
              <button className="text-primary text-[12px] font-headline-md font-bold hover:underline focus:outline-none cursor-pointer">
                View All
              </button>
            </div>
            
            {filteredTrips.length === 0 ? (
              <EmptyState onReset={handleResetFilters} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrips.map((trip) => (
                  <RecentTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </section>

          {/* Right Sidebar: Vehicle Status + Quick Actions */}
          <aside className="lg:col-span-4 space-y-6">
            <VehicleStatusPanel statuses={mockDashboardData.vehicleStatus} />
            <QuickActionsPanel actions={mockDashboardData.quickActions} />
          </aside>
        </div>

        {/* ── Live Operations Map ── */}
        <LiveOperationsMap
          metrics={mockDashboardData.mapMetrics}
          mapSearch={mapSearch}
          setMapSearch={setMapSearch}
        />
      </div>
    </section>
  );
};

export default Dashboard;
