import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsService } from '../services/settingsService';
import GlobalSettingsPanel from '../components/GlobalSettingsPanel';
import IntegrationsPanel from '../components/IntegrationsPanel';
import SecurityPanel from '../components/SecurityPanel';
import NotificationsPanel from '../components/NotificationsPanel';
import MaintenanceSkeleton from '../components/MaintenanceSkeleton';

const Settings = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    // Refresh configurations
    const data = await settingsService.getSettings();
    setSettings(data);
  };

  if (loading || !settings) {
    return <MaintenanceSkeleton />;
  }

  // Filter logic: if search query is present, check if role, depot, or integration matches.
  // We can pass the search query straight down or filter local lists.
  const filteredDepots = searchQuery
    ? settings.depots.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : settings.depots;

  const filteredIntegrations = searchQuery
    ? settings.integrations.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : settings.integrations;

  const filteredSecurity = {
    ...settings.security,
    roles: searchQuery
      ? settings.security.roles.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : settings.security.roles
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
      <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-6 animate-fade-in">
        
        {/* Column 1: Global & Localization (span-12 lg:col-span-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <GlobalSettingsPanel 
            coreSettings={settings.core}
            depots={filteredDepots}
            onSettingsUpdate={handleUpdate}
          />
          
          <IntegrationsPanel 
            integrations={filteredIntegrations}
            onIntegrationsUpdate={handleUpdate}
          />
        </div>

        {/* Column 2: RBAC & Security (span-12 lg:col-span-8) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <SecurityPanel 
            securityData={filteredSecurity}
            onSecurityUpdate={handleUpdate}
          />

          <NotificationsPanel 
            notifications={settings.notifications}
            onNotificationsUpdate={handleUpdate}
          />
        </div>

      </div>
    </div>
  );
};

export default Settings;
