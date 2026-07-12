// Mock Settings Service with LocalStorage persistence

const DEFAULT_SETTINGS = {
  core: {
    orgName: "Gandhinagar Municipal Transit",
    timezone: "IST (UTC+5:30)",
    dateFormat: "DD/MM/YYYY",
    currency: "INR (₹)",
    distanceUnit: "Kilometers"
  },
  depots: [
    { id: "depot-1", name: "GJ4 - Gandhinagar Central", role: "PRIMARY" },
    { id: "depot-2", name: "GJ1 - Ahmedabad North", role: "ACTIVE" }
  ],
  integrations: [
    { id: "int-1", name: "Verizon Connect", type: "Fleet Tracking", status: "Connected", code: "GPS" },
    { id: "int-2", name: "Shell Fleet Hub", type: "Expense Sync", status: "Connected", code: "FUEL" }
  ],
  security: {
    healthScore: 88,
    lastAuditDate: "Oct 24, 2023",
    lastAuditBy: "super_admin_01",
    roles: [
      { id: "role-1", name: "Fleet Manager", permissions: { fleet: "check_circle", trips: "View", financials: "check_circle", admin: "—" } },
      { id: "role-2", name: "Trip Dispatcher", permissions: { fleet: "View", trips: "check_circle", financials: "—", admin: "—" } },
      { id: "role-3", name: "Financial Analyst", permissions: { fleet: "—", trips: "—", financials: "check_circle", admin: "—" } }
    ]
  },
  notifications: {
    maintenance: { email: true, sms: true },
    dispatch: { push: true, emailSummary: false },
    financial: { pushLimit: true, smsBilling: false }
  }
};

const STORAGE_KEY = "transitops_system_controls";

const getSettingsStored = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

const setSettingsStored = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
};

// Initialize if empty
if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
  setSettingsStored(DEFAULT_SETTINGS);
}

export const settingsService = {
  getSettings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getSettingsStored());
      }, 200);
    });
  },

  saveCoreConfig: async (coreConfig) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        current.core = { ...current.core, ...coreConfig };
        setSettingsStored(current);
        resolve(current.core);
      }, 300);
    });
  },

  addDepot: async (name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        const newDepot = {
          id: `depot-${Date.now()}`,
          name,
          role: "ACTIVE"
        };
        current.depots = [...current.depots, newDepot];
        setSettingsStored(current);
        resolve(current.depots);
      }, 200);
    });
  },

  deleteDepot: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        current.depots = current.depots.filter(d => d.id !== id);
        setSettingsStored(current);
        resolve(current.depots);
      }, 200);
    });
  },

  addIntegration: async (name, type, code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        const newInt = {
          id: `int-${Date.now()}`,
          name,
          type,
          status: "Connected",
          code: code || name.substring(0, 4).toUpperCase()
        };
        current.integrations = [...current.integrations, newInt];
        setSettingsStored(current);
        resolve(current.integrations);
      }, 250);
    });
  },

  toggleIntegration: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        current.integrations = current.integrations.map(int => {
          if (int.id === id) {
            return {
              ...int,
              status: int.status === "Connected" ? "Disconnected" : "Connected"
            };
          }
          return int;
        });
        setSettingsStored(current);
        resolve(current.integrations);
      }, 200);
    });
  },

  addRole: async (roleName, permissions) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        const newRole = {
          id: `role-${Date.now()}`,
          name: roleName,
          permissions: permissions || { fleet: "—", trips: "—", financials: "—", admin: "—" }
        };
        current.security.roles = [...current.security.roles, newRole];
        setSettingsStored(current);
        resolve(current.security.roles);
      }, 250);
    });
  },

  updateRolePermission: async (roleId, permissionKey, value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        current.security.roles = current.security.roles.map(role => {
          if (role.id === roleId) {
            return {
              ...role,
              permissions: {
                ...role.permissions,
                [permissionKey]: value
              }
            };
          }
          return role;
        });
        setSettingsStored(current);
        resolve(current.security.roles);
      }, 150);
    });
  },

  saveNotificationPrefs: async (notificationPrefs) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getSettingsStored();
        current.notifications = { ...current.notifications, ...notificationPrefs };
        setSettingsStored(current);
        resolve(current.notifications);
      }, 200);
    });
  }
};
