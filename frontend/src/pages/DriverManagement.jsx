import React, { useState, useEffect } from 'react';
import { mockDrivers } from '../services/mockDriverData';
import DriverSidebar from '../components/DriverSidebar';
import DriverProfile from '../components/DriverProfile';
import DriverTabs from '../components/DriverTabs';
import LocationCard from '../components/LocationCard';
import Timeline from '../components/Timeline';

const DriverManagement = ({ searchQuery }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('License & Docs');

  // Fetch from backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        // Fetch from the real backend service
        const { driverService } = await import('../services/tripService');
        const apiDrivers = await driverService.getAllDrivers();
        
        // Merge real backend data with mock details for complex UI rendering
        const mergedDrivers = apiDrivers.map(apiDriver => {
          // Attempt to find matching mock by name to borrow realistic histories/stats
          const fallbackMock = mockDrivers.find(m => m.name === apiDriver.name) || mockDrivers[0];
          
          return {
            ...fallbackMock,
            id: apiDriver.id.toString(),
            name: apiDriver.name,
            status: apiDriver.status,
            routeStatus: apiDriver.status,
            licenseExpiration: apiDriver.license_expiry_date,
            contact_number: apiDriver.contact_number,
            safetyScore: apiDriver.safety_score,
            licenseDetails: {
              ...fallbackMock.licenseDetails,
              documentNumber: apiDriver.license_number,
              classType: apiDriver.license_category
            }
          };
        });
        
        setDrivers(mergedDrivers);
        if (mergedDrivers.length > 0) {
          setSelectedDriver(mergedDrivers[0]);
        }
      } catch (err) {
        console.error('Failed to load drivers from API, falling back to mocks:', err);
        setDrivers(mockDrivers);
        if (mockDrivers.length > 0) {
          setSelectedDriver(mockDrivers[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrivers();
  }, []);

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    // Reset tab to default when changing driver, or preserve active tab
  };

  // Filter & Search Logic
  const filteredDrivers = drivers.filter((d) => {
    // 1. Status Filter
    if (filter === 'ON_DUTY' && d.status !== 'On Duty') return false;
    if (filter === 'OFF_DUTY' && d.status !== 'Off Duty') return false;
    if (filter === 'SUSPENDED' && d.status !== 'Suspended') return false;

    // 2. Search Query Filter (Matches Name, ID, or License Document Number)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = d.name?.toLowerCase().includes(q);
      const idMatch = d.id?.toLowerCase().includes(q);
      const docMatch = d.licenseDetails?.documentNumber?.toLowerCase().includes(q);
      return nameMatch || idMatch || docMatch;
    }

    return true;
  });

  // Keep selected driver updated if list changes or ensure selected driver exists in filtered list
  useEffect(() => {
    if (!loading && filteredDrivers.length > 0) {
      const exists = filteredDrivers.some(d => d.id === selectedDriver?.id);
      if (!exists) {
        setSelectedDriver(filteredDrivers[0]);
      }
    }
  }, [filter, searchQuery, loading]);

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* LEFT PANEL: DRIVER LIST & FILTERS */}
      <DriverSidebar
        drivers={filteredDrivers}
        selectedDriver={selectedDriver}
        onSelectDriver={handleSelectDriver}
        filter={filter}
        setFilter={setFilter}
        loading={loading}
      />

      {/* RIGHT PANEL: DETAIL VIEW */}
      <section className="flex-1 min-h-0 bg-background flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8">
        {loading ? (
          // Detail Loading Skeleton
          <div className="space-y-8 animate-pulse">
            <div className="bg-white rounded-2xl p-8 border border-border h-48 flex gap-6">
              <div className="w-32 h-32 bg-secondary-container rounded-3xl"></div>
              <div className="flex-grow space-y-4 pt-4">
                <div className="h-6 bg-secondary-container rounded w-1/3"></div>
                <div className="h-4 bg-secondary-container rounded w-1/4"></div>
                <div className="h-8 bg-secondary-container rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 bg-white rounded-2xl p-6 border border-border h-64"></div>
              <div className="col-span-4 bg-white rounded-2xl p-6 border border-border h-64"></div>
            </div>
          </div>
        ) : selectedDriver ? (
          <div className="flex flex-col flex-1 animate-page-fade">
            {/* Header & Basic Stats Card */}
            <DriverProfile
              driver={selectedDriver}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Bento Grid layout */}
            <div className="grid grid-cols-12 gap-6 pb-12 items-start">
              {/* Dynamic tab contents (CDL details, trips, safety, etc.) */}
              <div className="col-span-12 lg:col-span-8">
                <DriverTabs activeTab={activeTab} driver={selectedDriver} />
              </div>

              {/* Current Location telemetry and Map */}
              <div className="col-span-12 lg:col-span-4">
                <LocationCard location={selectedDriver.currentLocation} />
              </div>

              {/* Safety Timeline details */}
              <div className="col-span-12">
                <Timeline events={selectedDriver.safetyTimeline} />
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-border shadow-sm p-12 text-center my-auto max-w-lg mx-auto">
            <span className="material-symbols-outlined text-[64px] text-secondary mb-4 select-none">
              person_search
            </span>
            <h3 className="font-headline-md text-headline-md text-primary font-black text-lg mb-2">
              No Active Driver Selected
            </h3>
            <p className="text-xs text-secondary max-w-sm leading-normal">
              Please select a driver from the left-hand panel list or clear your search criteria to view driver profiles and documentation.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DriverManagement;
