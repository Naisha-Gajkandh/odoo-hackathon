import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsService } from '../services/settingsService';

const GlobalSettingsPanel = ({ coreSettings, depots, onSettingsUpdate }) => {
  const [orgName, setOrgName] = useState('');
  const [timezone, setTimezone] = useState('IST (UTC+5:30)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('INR (₹)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers');
  const [isSaving, setIsSaving] = useState(false);

  // Manage Depot States
  const [showDepotManager, setShowDepotManager] = useState(false);
  const [newDepotName, setNewDepotName] = useState('');
  const [localDepots, setLocalDepots] = useState(depots || []);

  useEffect(() => {
    if (coreSettings) {
      setOrgName(coreSettings.orgName || '');
      setTimezone(coreSettings.timezone || 'IST (UTC+5:30)');
      setDateFormat(coreSettings.dateFormat || 'DD/MM/YYYY');
      setCurrency(coreSettings.currency || 'INR (₹)');
      setDistanceUnit(coreSettings.distanceUnit || 'Kilometers');
    }
  }, [coreSettings]);

  useEffect(() => {
    setLocalDepots(depots || []);
  }, [depots]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      toast.error('Organization Name cannot be empty.');
      return;
    }

    try {
      setIsSaving(true);
      const updated = await settingsService.saveCoreConfig({
        orgName,
        timezone,
        dateFormat,
        currency,
        distanceUnit
      });
      toast.success('Core configuration saved successfully.');
      onSettingsUpdate();
    } catch (err) {
      toast.error('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDepot = async (e) => {
    e.preventDefault();
    if (!newDepotName.trim()) return;

    try {
      const updated = await settingsService.addDepot(newDepotName.trim());
      setLocalDepots(updated);
      setNewDepotName('');
      toast.success(`Depot "${newDepotName}" added.`);
      onSettingsUpdate();
    } catch (err) {
      toast.error('Failed to add depot.');
    }
  };

  const handleDeleteDepot = async (id, name) => {
    try {
      const updated = await settingsService.deleteDepot(id);
      setLocalDepots(updated);
      toast.success(`Depot "${name}" removed.`);
      onSettingsUpdate();
    } catch (err) {
      toast.error('Failed to remove depot.');
    }
  };

  return (
    <div className="console-panel relative overflow-hidden bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
      {/* Decorative illustration */}
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none select-none">
        <img 
          alt="Global Settings" 
          className="w-48 h-48 object-contain" 
          src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
        />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[22px]">public</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Global Settings</h3>
          <p className="text-[10px] text-secondary uppercase tracking-widest">Core localization &amp; naming</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 relative z-10">
        <div className="input-group space-y-1">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Organization Name</label>
          <input 
            className="input-field w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            type="text" 
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="input-group space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Timezone</label>
            <select 
              className="input-field w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
              <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
              <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
            </select>
          </div>

          <div className="input-group space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Date Format</label>
            <select 
              className="input-field w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="input-group space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Currency</label>
            <input 
              className="input-field w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
              type="text" 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>

          <div className="input-group space-y-1">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Distance Unit</label>
            <select 
              className="input-field w-full px-3 py-2 bg-background border border-border/80 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value)}
            >
              <option value="Kilometers">Kilometers</option>
              <option value="Miles">Miles</option>
            </select>
          </div>
        </div>

        {/* Depots Section */}
        <div className="pt-4 border-t border-border/40 mt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Active Depots</label>
            <button 
              type="button"
              onClick={() => setShowDepotManager(!showDepotManager)}
              className="text-transit-blue text-[10px] font-bold hover:underline focus:outline-none"
            >
              {showDepotManager ? 'DONE' : 'MANAGE'}
            </button>
          </div>

          {showDepotManager && (
            <div className="mb-3 p-3 bg-secondary-container/20 rounded-lg border border-border/30 animate-fade-in">
              <form onSubmit={handleAddDepot} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder="New depot name..."
                  className="flex-1 px-2.5 py-1.5 bg-white border border-border rounded text-xs font-semibold focus:outline-none"
                  value={newDepotName}
                  onChange={(e) => setNewDepotName(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-primary text-on-primary text-[10px] font-bold px-3 rounded hover:opacity-90 active:scale-95 transition-all"
                >
                  ADD
                </button>
              </form>
              <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                {localDepots.map(depot => (
                  <div key={depot.id} className="flex justify-between items-center bg-white px-2 py-1 rounded border border-border/40 text-[11px]">
                    <span className="font-semibold text-primary">{depot.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteDepot(depot.id, depot.name)}
                      className="text-error hover:scale-105 active:scale-95 transition-all focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 select-none">
            {localDepots.map((depot) => (
              <div 
                key={depot.id} 
                className="flex items-center justify-between p-2 bg-secondary-container/20 rounded border border-border/20"
              >
                <span className="text-xs font-bold text-primary">{depot.name}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-black ${
                  depot.role === 'PRIMARY' 
                    ? 'bg-transit-blue-container text-transit-blue border border-transit-blue/20' 
                    : 'bg-secondary-container text-secondary border border-border/40'
                }`}>
                  {depot.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="mt-6 w-full bg-primary text-on-primary font-bold py-2.5 px-6 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus:outline-none shadow-sm text-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>{isSaving ? 'Saving...' : 'Save Core Config'}</span>
        </button>
      </form>
    </div>
  );
};

export default GlobalSettingsPanel;
