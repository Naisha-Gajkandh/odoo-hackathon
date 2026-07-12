import React from 'react';
import toast from 'react-hot-toast';
import { settingsService } from '../services/settingsService';

const NotificationsPanel = ({ notifications, onNotificationsUpdate }) => {
  if (!notifications) return null;

  const handleToggle = async (sectionKey, preferenceKey, label) => {
    try {
      const updatedSection = {
        ...notifications[sectionKey],
        [preferenceKey]: !notifications[sectionKey][preferenceKey]
      };
      
      const newNotifications = {
        ...notifications,
        [sectionKey]: updatedSection
      };

      await settingsService.saveNotificationPrefs(newNotifications);
      
      const stateLabel = newNotifications[sectionKey][preferenceKey] ? 'enabled' : 'disabled';
      toast.success(`${label} ${stateLabel}.`);
      onNotificationsUpdate();
    } catch (err) {
      toast.error('Failed to update notification preferences.');
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => {
    return (
      <label className="relative inline-block w-8 h-5 select-none">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-8 h-5 bg-border rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-primary"></div>
      </label>
    );
  };

  return (
    <div className="bg-transit-blue-container/20 p-6 rounded-xl border border-transit-blue/15 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">notifications_active</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Notification Preferences</h3>
          <p className="text-[10px] text-secondary uppercase tracking-widest">Global Alert Configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Maintenance Preferences */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Maintenance</p>
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs text-primary font-semibold">Email Alerts</span>
            <ToggleSwitch 
              checked={notifications.maintenance.email}
              onChange={() => handleToggle('maintenance', 'email', 'Maintenance email alerts')}
            />
          </div>
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs text-primary font-semibold">SMS Critical</span>
            <ToggleSwitch 
              checked={notifications.maintenance.sms}
              onChange={() => handleToggle('maintenance', 'sms', 'Maintenance critical SMS')}
            />
          </div>
        </div>

        {/* Dispatch Preferences */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Dispatch</p>
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs text-primary font-semibold">Push (App)</span>
            <ToggleSwitch 
              checked={notifications.dispatch.push}
              onChange={() => handleToggle('dispatch', 'push', 'Dispatch push notifications')}
            />
          </div>
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs text-primary font-semibold">Email Daily Summary</span>
            <ToggleSwitch 
              checked={notifications.dispatch.emailSummary}
              onChange={() => handleToggle('dispatch', 'emailSummary', 'Daily summary email')}
            />
          </div>
        </div>

        {/* Financial Preferences */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Financial</p>
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs text-primary font-semibold">Push (Limit Alert)</span>
            <ToggleSwitch 
              checked={notifications.financial.pushLimit}
              onChange={() => handleToggle('financial', 'pushLimit', 'Budget limit push alerts')}
            />
          </div>
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs text-primary font-semibold">SMS Billing</span>
            <ToggleSwitch 
              checked={notifications.financial.smsBilling}
              onChange={() => handleToggle('financial', 'smsBilling', 'Billing details SMS')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
