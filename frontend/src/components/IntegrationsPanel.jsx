import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { settingsService } from '../services/settingsService';

const IntegrationsPanel = ({ integrations, onIntegrationsUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [code, setCode] = useState('');

  const handleToggle = async (id, currentStatus, name) => {
    try {
      const updated = await settingsService.toggleIntegration(id);
      const newStatus = currentStatus === 'Connected' ? 'disconnected' : 'connected';
      toast.success(`${name} ${newStatus}.`);
      onIntegrationsUpdate();
    } catch (err) {
      toast.error('Failed to update integration status.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !type.trim()) {
      toast.error('Please enter name and type.');
      return;
    }

    try {
      const integrationCode = code.trim().toUpperCase() || name.trim().substring(0, 4).toUpperCase();
      await settingsService.addIntegration(name.trim(), type.trim(), integrationCode);
      toast.success(`Integration "${name}" added successfully.`);
      setName('');
      setType('');
      setCode('');
      setShowAddForm(false);
      onIntegrationsUpdate();
    } catch (err) {
      toast.error('Failed to add integration.');
    }
  };

  return (
    <div className="console-panel bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[22px]">hub</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">API &amp; Integrations</h3>
          <p className="text-[10px] text-secondary uppercase tracking-widest">External Data Streams</p>
        </div>
      </div>

      <div className="space-y-3">
        {integrations.map((int) => {
          const isConnected = int.status === 'Connected';
          return (
            <div 
              key={int.id} 
              className="flex items-center justify-between p-3 border border-border/80 rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center text-[10px] font-black uppercase tracking-wider">
                  {int.code}
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">{int.name}</p>
                  <p className="text-[9px] text-secondary font-bold uppercase tracking-wider">{int.type}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleToggle(int.id, int.status, int.name)}
                className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer focus:outline-none transition-all active:scale-95 ${
                  isConnected
                    ? 'bg-success-green-container text-on-success-green border-success-green/20'
                    : 'bg-error-container text-error border-error/20'
                }`}
              >
                {int.status}
              </button>
            </div>
          );
        })}

        {showAddForm ? (
          <form onSubmit={handleAdd} className="p-3 bg-secondary-container/20 rounded-lg border border-border/40 space-y-3.5 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-secondary uppercase tracking-wider">Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Garmin Connect"
                className="w-full px-2.5 py-1.5 bg-white border border-border rounded text-xs focus:outline-none focus:border-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-secondary uppercase tracking-wider">Type / Purpose *</label>
              <input 
                type="text" 
                placeholder="e.g. Telematics Sync"
                className="w-full px-2.5 py-1.5 bg-white border border-border rounded text-xs focus:outline-none focus:border-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-secondary uppercase tracking-wider">Abbreviation Code</label>
              <input 
                type="text" 
                placeholder="e.g. GPS, API"
                className="w-full px-2.5 py-1.5 bg-white border border-border rounded text-xs focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-1.5 bg-secondary-container text-secondary text-[10px] font-bold rounded hover:opacity-90 focus:outline-none"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded hover:opacity-90 focus:outline-none"
              >
                Add Link
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 border-2 border-dashed border-border/80 hover:border-primary/40 rounded-lg text-secondary hover:text-primary text-[10px] font-bold hover:bg-secondary-container/10 transition-colors uppercase tracking-widest focus:outline-none"
          >
            + Add New Integration
          </button>
        )}
      </div>
    </div>
  );
};

export default IntegrationsPanel;
