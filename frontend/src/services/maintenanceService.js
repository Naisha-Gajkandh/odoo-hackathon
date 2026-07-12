// Mock Maintenance Service with LocalStorage persistence

const DEFAULT_ACTIVE_LOGS = [
  {
    id: "MH-01-AB-1234",
    vehicleId: "MH-01-AB-1234",
    serviceType: "Engine Diagnostic",
    vehicleType: "Mini Truck",
    vehicleClass: "Tata Ace — Light Commercial Vehicle",
    status: "IN SHOP",
    timeText: "Since 08:30 AM",
    description: "Engine Diagnostics Underway",
    engineIntegrity: 42,
    lastService: "12 May 2025",
    totalMileage: "1,42,500 km",
    completionPercentage: 75,
    targetCompletion: "04:30 PM Today",
    completionNotes: "Work is currently 15 minutes ahead of schedule based on current technician velocity.",
    assignedTechnician: "",
    icon: "build"
  },
  {
    id: "KA-04-CD-5678",
    vehicleId: "KA-04-CD-5678",
    serviceType: "Brake Pad Replacement",
    vehicleType: "Pickup Truck",
    vehicleClass: "Mahindra Bolero Pickup",
    status: "IN SHOP",
    timeText: "Since 11:15 AM",
    description: "Replacing worn front brake pads and rotors.",
    engineIntegrity: 85,
    lastService: "18 Jan 2025",
    totalMileage: "84,200 km",
    completionPercentage: 40,
    targetCompletion: "06:00 PM Today",
    completionNotes: "Waiting for parts delivery from the Mahindra authorized warehouse.",
    assignedTechnician: "Ravi Mehta",
    icon: "build"
  },
  {
    id: "DL-09-EF-9012",
    vehicleId: "DL-09-EF-9012",
    serviceType: "Sensor Calibration",
    vehicleType: "Light Commercial Vehicle",
    vehicleClass: "Ashok Leyland Dost",
    status: "IN SHOP",
    timeText: "Since Yesterday",
    description: "Forward collision sensor and radar calibration.",
    engineIntegrity: 92,
    lastService: "05 Nov 2025",
    totalMileage: "1,12,400 km",
    completionPercentage: 90,
    targetCompletion: "12:30 PM Today",
    completionNotes: "Final calibration tests in progress at the Ashok Leyland service centre.",
    assignedTechnician: "Sanjay Iyer",
    icon: "build"
  },
  {
    id: "TN-10-GH-3456",
    vehicleId: "TN-10-GH-3456",
    serviceType: "Routine Oil Change",
    vehicleType: "Truck",
    vehicleClass: "Tata 407 — Medium Duty Truck",
    status: "Scheduled",
    timeText: "Pending Arrival",
    description: "Scheduled 50k mileage oil and filter replacement.",
    engineIntegrity: 78,
    lastService: "15 Dec 2025",
    totalMileage: "45,600 km",
    completionPercentage: 0,
    targetCompletion: "Tomorrow 09:00 AM",
    completionNotes: "Vehicle is currently on route, expected arrival at Tata service centre by 06:00 PM.",
    assignedTechnician: "",
    icon: "oil_barrel"
  }
];

const DEFAULT_HISTORY = [
  {
    id: "hist-1",
    vehicleId: "MH-01-AB-1234",
    serviceType: "Oil Change",
    cost: 2500,
    status: "IN SHOP",
    date: "07/07/2026"
  },
  {
    id: "hist-2",
    vehicleId: "KA-04-CD-5678",
    serviceType: "Brake Check",
    cost: 1200,
    status: "COMPLETED",
    date: "07/06/2026"
  },
  {
    id: "hist-3",
    vehicleId: "DL-09-EF-9012",
    serviceType: "Tyre Rotation",
    cost: 800,
    status: "COMPLETED",
    date: "05/12/2025"
  }
];

const STORAGE_KEYS = {
  ACTIVE_LOGS: "transitops_active_logs",
  HISTORY: "transitops_maintenance_history"
};

const getStoredData = (key, defaultVal) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultVal;
  } catch (e) {
    console.error("Error reading localStorage key: " + key, e);
    return defaultVal;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error setting localStorage key: " + key, e);
  }
};

// Initialize localStorage if empty
if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.ACTIVE_LOGS)) {
  setStoredData(STORAGE_KEYS.ACTIVE_LOGS, DEFAULT_ACTIVE_LOGS);
}
if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.HISTORY)) {
  setStoredData(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY);
}

export const maintenanceService = {
  // Fetch active logs
  getActiveLogs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData(STORAGE_KEYS.ACTIVE_LOGS, DEFAULT_ACTIVE_LOGS);
        resolve(data);
      }, 300); // Simulate API latency
    });
  },

  // Save/Create a new active log
  createActiveLog: async (logData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentLogs = getStoredData(STORAGE_KEYS.ACTIVE_LOGS, DEFAULT_ACTIVE_LOGS);
        const newLog = {
          id: logData.vehicleId || `V-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          vehicleId: logData.vehicleId,
          serviceType: logData.serviceType,
          vehicleType: logData.vehicleType || "General Fleet",
          vehicleClass: logData.vehicleClass || "Standard Fleet Vehicle",
          status: logData.status || "IN SHOP",
          timeText: logData.timeText || "Just Logged",
          description: logData.description || "Routine Diagnostics",
          engineIntegrity: logData.engineIntegrity || 100,
          lastService: logData.lastService || new Date().toLocaleDateString('en-GB'),
          totalMileage: logData.totalMileage || "10,000 km",
          completionPercentage: parseInt(logData.completionPercentage) || 0,
          targetCompletion: logData.targetCompletion || "Pending Schedule",
          completionNotes: logData.completionNotes || "Initial diagnostic check scheduled.",
          assignedTechnician: logData.assignedTechnician || "",
          icon: logData.icon || "build"
        };
        const updated = [newLog, ...currentLogs];
        setStoredData(STORAGE_KEYS.ACTIVE_LOGS, updated);
        resolve(newLog);
      }, 300);
    });
  },

  // Update an active log
  updateActiveLog: async (id, updatedFields) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentLogs = getStoredData(STORAGE_KEYS.ACTIVE_LOGS, DEFAULT_ACTIVE_LOGS);
        const updated = currentLogs.map(log => {
          if (log.id === id) {
            return { ...log, ...updatedFields };
          }
          return log;
        });
        setStoredData(STORAGE_KEYS.ACTIVE_LOGS, updated);
        const updatedLog = updated.find(l => l.id === id);
        resolve(updatedLog);
      }, 200);
    });
  },

  // Close record (moves active log to COMPLETED status and adds it to history list)
  closeActiveLog: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentLogs = getStoredData(STORAGE_KEYS.ACTIVE_LOGS, DEFAULT_ACTIVE_LOGS);
        const logToClose = currentLogs.find(log => log.id === id);
        
        if (!logToClose) {
          resolve(null);
          return;
        }

        // Add to history
        const currentHistory = getStoredData(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY);
        const historyItem = {
          id: `hist-${Date.now()}`,
          vehicleId: logToClose.vehicleId,
          serviceType: logToClose.serviceType,
          cost: Math.floor(Math.random() * 3000) + 500, // random cost simulation
          status: "COMPLETED",
          date: new Date().toLocaleDateString('en-GB')
        };
        setStoredData(STORAGE_KEYS.HISTORY, [historyItem, ...currentHistory]);

        // Remove log from active logs
        const updatedLogs = currentLogs.filter(log => log.id !== id);
        setStoredData(STORAGE_KEYS.ACTIVE_LOGS, updatedLogs);
        
        resolve({ closedLog: logToClose, historyItem });
      }, 300);
    });
  },

  // Get service history
  getHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getStoredData(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY);
        resolve(data);
      }, 300);
    });
  },

  // Add history record
  createHistoryItem: async (historyData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentHistory = getStoredData(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY);
        const newItem = {
          id: historyData.id || `hist-${Date.now()}`,
          vehicleId: historyData.vehicleId,
          serviceType: historyData.serviceType,
          cost: parseFloat(historyData.cost) || 0,
          status: historyData.status || "IN SHOP",
          date: historyData.date || new Date().toLocaleDateString('en-GB')
        };
        const updated = [newItem, ...currentHistory];
        setStoredData(STORAGE_KEYS.HISTORY, updated);
        resolve(newItem);
      }, 200);
    });
  }
};
