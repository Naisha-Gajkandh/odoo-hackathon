import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { settingsService } from '../services/settingsService';

const SecurityPanel = ({ securityData, onSecurityUpdate }) => {
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const permissionCycles = ["—", "View", "check_circle"];

  const handleCellClick = async (roleId, permissionKey, currentVal) => {
    let nextIndex = permissionCycles.indexOf(currentVal) + 1;
    if (nextIndex >= permissionCycles.length) nextIndex = 0;
    const nextVal = permissionCycles[nextIndex];

    try {
      await settingsService.updateRolePermission(roleId, permissionKey, nextVal);
      onSecurityUpdate();
    } catch (err) {
      toast.error('Failed to update permission.');
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.error('Role name cannot be empty.');
      return;
    }

    try {
      await settingsService.addRole(newRoleName.trim());
      toast.success(`Role "${newRoleName}" added to matrix.`);
      setNewRoleName('');
      setShowAddRoleForm(false);
      onSecurityUpdate();
    } catch (err) {
      toast.error('Failed to add role.');
    }
  };

  const getPermissionCell = (roleId, key, value) => {
    if (value === 'check_circle') {
      return (
        <button
          type="button"
          onClick={() => handleCellClick(roleId, key, value)}
          className="material-symbols-outlined check-mark text-sm text-transit-blue hover:scale-110 active:scale-95 transition-all focus:outline-none"
        >
          check_circle
        </button>
      );
    }
    if (value === 'View') {
      return (
        <button
          type="button"
          onClick={() => handleCellClick(roleId, key, value)}
          className="status-pill status-view text-[9px] px-2 py-0.5 rounded border border-transit-blue/20 bg-transit-blue-container text-transit-blue font-bold uppercase hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          View
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => handleCellClick(roleId, key, value)}
        className="text-outline text-xs hover:text-primary hover:font-bold transition-all w-8 text-center focus:outline-none"
      >
        —
      </button>
    );
  };

  return (
    <div className="console-panel relative overflow-hidden bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
      {/* Decorative illustration */}
      <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none select-none">
        <img 
          alt="Security Panel" 
          className="w-64 h-64 object-contain" 
          src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
        />
      </div>

      <div className="flex justify-between items-start mb-8 relative z-10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">security</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Access Control (RBAC)</h3>
            <p className="text-[10px] text-secondary uppercase tracking-widest">Permission Matrix &amp; Safety Audit</p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddRoleForm(!showAddRoleForm)}
          className="bg-white border border-primary text-primary px-4 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-primary hover:text-on-primary transition-all duration-200 active:scale-95 focus:outline-none shadow-sm uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-xs font-bold">add</span> 
          <span>Add New Role</span>
        </button>
      </div>

      {showAddRoleForm && (
        <form onSubmit={handleAddRole} className="mb-6 p-4 bg-secondary-container/20 rounded-xl border border-border/40 flex items-end gap-3 max-w-md animate-fade-in relative z-10">
          <div className="flex-1 space-y-1">
            <label className="text-[9px] font-bold text-secondary uppercase tracking-wider">New Role Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Operations Assistant"
              className="w-full px-2.5 py-1.5 bg-white border border-border rounded text-xs focus:outline-none focus:border-primary"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-primary text-on-primary text-[10px] font-bold px-4 py-2 rounded hover:opacity-90 active:scale-95 transition-all"
          >
            CREATE
          </button>
        </form>
      )}

      <div className="grid grid-cols-12 gap-6 mb-8 relative z-10">
        {/* Permission Table */}
        <div className="col-span-12 lg:col-span-8">
          <div className="overflow-hidden border border-border/50 rounded-lg">
            <table className="rbac-table w-full text-left border-collapse min-w-[450px]">
              <thead>
                <tr className="bg-secondary-container/30 text-[10px] text-secondary uppercase font-bold border-b border-border/50">
                  <th className="px-4 py-3 w-1/3">Role Name</th>
                  <th className="px-4 py-3">Fleet</th>
                  <th className="px-4 py-3">Trips</th>
                  <th className="px-4 py-3">Financials</th>
                  <th className="px-4 py-3">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-white">
                {securityData.roles.map((role) => (
                  <tr key={role.id} className="hover:bg-secondary-container/10 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-xs text-primary">{role.name}</td>
                    <td className="px-4 py-3.5">{getPermissionCell(role.id, 'fleet', role.permissions.fleet)}</td>
                    <td className="px-4 py-3.5">{getPermissionCell(role.id, 'trips', role.permissions.trips)}</td>
                    <td className="px-4 py-3.5">{getPermissionCell(role.id, 'financials', role.permissions.financials)}</td>
                    <td className="px-4 py-3.5">{getPermissionCell(role.id, 'admin', role.permissions.admin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[9px] text-secondary mt-2 italic">* Click on cells to cycle permissions (Check &bull; View &bull; None)</p>
        </div>

        {/* Security Health & Audit Info */}
        <div className="col-span-12 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          <div className="p-4 border border-border/50 rounded-lg bg-secondary-container/20 flex-1">
            <p className="text-[9px] font-bold text-secondary uppercase mb-1">Security Health</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold text-primary">{securityData.healthScore}%</span>
              <span className="text-[9px] text-transit-blue font-black tracking-wide">STABLE</span>
            </div>
            <div className="w-full bg-secondary-container rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${securityData.healthScore}%` }}></div>
            </div>
          </div>
          
          <div className="p-4 border border-border/50 rounded-lg bg-white flex-1">
            <p className="text-[9px] font-bold text-secondary uppercase mb-1">Last System Audit</p>
            <p className="text-xs font-bold text-primary mb-1">{securityData.lastAuditDate}</p>
            <p className="text-[9px] text-secondary font-semibold italic">By: {securityData.lastAuditBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;
