import React from 'react';
import LicenseCard from './LicenseCard';

const DriverTabs = ({ activeTab, driver }) => {
  if (!driver) return null;

  switch (activeTab) {
    case 'License & Docs':
      return (
        <div className="animate-fade-in">
          <LicenseCard license={driver.licenseDetails} />
        </div>
      );

    case 'Trip History':
      return (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
          <h3 className="font-bold text-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-transit-blue text-[20px]">route</span>
            Recent Trips &amp; Routes
          </h3>
          {driver.tripHistory && driver.tripHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] text-secondary font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Trip ID</th>
                    <th className="pb-3 pr-4">Route</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Cargo</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs text-primary">
                  {driver.tripHistory.map((trip) => (
                    <tr key={trip.id} className="hover:bg-background transition-colors">
                      <td className="py-3.5 pr-4 font-black text-transit-blue">{trip.id}</td>
                      <td className="py-3.5 pr-4 font-bold">{trip.route}</td>
                      <td className="py-3.5 pr-4 font-semibold text-secondary">{trip.date}</td>
                      <td className="py-3.5 pr-4 text-secondary">{trip.cargo}</td>
                      <td className="py-3.5">
                        <span className="bg-success-green-container text-on-success-green px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-secondary text-xs italic">
              No recent trips logged for this driver.
            </div>
          )}
        </div>
      );

    case 'Safety Analytics':
      const sa = driver.safetyAnalytics || {};
      return (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
          <h3 className="font-bold text-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-transit-blue text-[20px]">analytics</span>
            Safety Metrics &amp; Telemetry
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 bg-background rounded-xl border border-border/40 text-center">
              <span className="material-symbols-outlined text-error text-[28px] mb-2">emergency</span>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Hard Braking</p>
              <p className="text-xl font-black text-primary">{sa.hardBrakingEvents} Events</p>
            </div>
            
            <div className="p-4 bg-background rounded-xl border border-border/40 text-center">
              <span className="material-symbols-outlined text-warning-orange text-[28px] mb-2">speed</span>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Speeding Alerts</p>
              <p className="text-xl font-black text-primary">{sa.speedingAlerts} Alerts</p>
            </div>
            
            <div className="p-4 bg-background rounded-xl border border-border/40 text-center">
              <span className="material-symbols-outlined text-transit-blue text-[28px] mb-2">schedule</span>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Idle Time Rate</p>
              <p className="text-xl font-black text-primary">{sa.idleTimePercent}</p>
            </div>
            
            <div className="p-4 bg-background rounded-xl border border-border/40 text-center">
              <span className="material-symbols-outlined text-success-green text-[28px] mb-2">verified</span>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Safe Miles Driven</p>
              <p className="text-xl font-black text-primary">{sa.totalSafeMiles}</p>
            </div>
            
            <div className="p-4 bg-background rounded-xl border border-border/40 text-center">
              <span className="material-symbols-outlined text-secondary text-[28px] mb-2">insights</span>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Incident Rate</p>
              <p className="text-xl font-black text-primary">{sa.incidentRate}</p>
            </div>
          </div>
        </div>
      );

    case 'Contact Info':
      const contact = driver.contactInfo || {};
      return (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
          <h3 className="font-bold text-sm text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-transit-blue text-[20px]">contact_phone</span>
            Contact Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-primary">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-bold text-sm truncate">{contact.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Phone Number</p>
                <p className="font-bold text-sm">{contact.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Home Address</p>
                <p className="font-semibold text-secondary leading-normal">{contact.address}</p>
              </div>
            </div>
            
            <div className="space-y-4 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
              <div>
                <p className="text-[10px] text-error font-bold uppercase tracking-wider mb-1">Emergency Contact</p>
                <p className="font-bold text-sm">{contact.emergencyContact}</p>
              </div>
              <div>
                <p className="text-[10px] text-error font-bold uppercase tracking-wider mb-1">Emergency Phone</p>
                <p className="font-bold text-sm">{contact.emergencyPhone}</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default DriverTabs;
