// Mock Fuel & Expense Service with LocalStorage persistence

const DEFAULT_OVERVIEW_DATA = {
  monthly: {
    totalOperationalCost: 142580,
    trendChange: "4.2%",
    maintenanceCost: 32410,
    efficiencyScore: 84,
    cards: [
      {
        id: "VHC-8829-XL",
        vehicleId: "VHC-8829-XL",
        type: "Long-Haul Trailer",
        zone: "Zone A",
        status: "Active",
        usagePercentage: 70,
        limit: 12000,
        fuelCosts: 6420.50,
        tollsFees: 1280.00,
        icon: "local_shipping"
      },
      {
        id: "VAN-4412-SM",
        vehicleId: "VAN-4412-SM",
        type: "Last-Mile Delivery",
        zone: "Zone B",
        status: "Over Budget",
        usagePercentage: 92,
        limit: 4500,
        fuelCosts: 3840.10,
        tollsFees: 300.20,
        icon: "delivery_dining"
      },
      {
        id: "HDT-2022-RT",
        vehicleId: "HDT-2022-RT",
        type: "Heavy Duty Trans",
        zone: "Regional",
        status: "Standby",
        usagePercentage: 45,
        limit: 25000,
        fuelCosts: 9220.00,
        tollsFees: 2110.00,
        icon: "fire_truck"
      }
    ],
    weeklyTrend: [
      { day: "Mon", amount: 1200 },
      { day: "Tue", amount: 2400 },
      { day: "Wed", amount: 1600 },
      { day: "Thu", amount: 2000 },
      { day: "Fri", amount: 2800 },
      { day: "Sat", amount: 3200 },
      { day: "Sun", amount: 1400 }
    ],
    transactions: [
      {
        id: "TX-9021",
        vehicleId: "VHC-8829-XL",
        description: "Shell Gas Station - Munich North",
        category: "FUEL",
        date: "Oct 24, 2023 &bull; 08:45 AM",
        rawDate: "2023-10-24T08:45:00",
        amount: 480.00,
        items: [
          { name: "Premium Diesel Fuel", qty: "320 L", cost: 450.00 },
          { name: "Windshield Washer Fluid", qty: "1", cost: 30.00 }
        ]
      },
      {
        id: "TX-9022",
        vehicleId: "VAN-4412-SM",
        description: "Electronic Toll Collection - A9 Hub",
        category: "TOLLS",
        date: "Oct 24, 2023 &bull; 11:20 AM",
        rawDate: "2023-10-24T11:20:00",
        amount: 22.50,
        items: [
          { name: "Standard Toll Pass - Class 2", qty: "1", cost: 22.50 }
        ]
      },
      {
        id: "TX-9023",
        vehicleId: "HDT-2022-RT",
        description: "Service Center #402 - Brake Check",
        category: "REPAIR",
        date: "Oct 23, 2023 &bull; 04:15 PM",
        rawDate: "2023-10-23T16:15:00",
        amount: 1250.00,
        items: [
          { name: "Front Rotors & Brake Pads Set", qty: "1", cost: 850.00 },
          { name: "Labor Hours - Calibration", qty: "4 hrs", cost: 400.00 }
        ]
      }
    ]
  },
  quarterly: {
    totalOperationalCost: 427740,
    trendChange: "3.8%",
    maintenanceCost: 97230,
    efficiencyScore: 86,
    cards: [
      {
        id: "VHC-8829-XL",
        vehicleId: "VHC-8829-XL",
        type: "Long-Haul Trailer",
        zone: "Zone A",
        status: "Active",
        usagePercentage: 65,
        limit: 36000,
        fuelCosts: 19260.50,
        tollsFees: 3840.00,
        icon: "local_shipping"
      },
      {
        id: "VAN-4412-SM",
        vehicleId: "VAN-4412-SM",
        type: "Last-Mile Delivery",
        zone: "Zone B",
        status: "Over Budget",
        usagePercentage: 94,
        limit: 13500,
        fuelCosts: 11520.10,
        tollsFees: 900.60,
        icon: "delivery_dining"
      },
      {
        id: "HDT-2022-RT",
        vehicleId: "HDT-2022-RT",
        type: "Heavy Duty Trans",
        zone: "Regional",
        status: "Standby",
        usagePercentage: 42,
        limit: 75000,
        fuelCosts: 27660.00,
        tollsFees: 6330.00,
        icon: "fire_truck"
      }
    ],
    weeklyTrend: [
      { day: "Mon", amount: 3600 },
      { day: "Tue", amount: 7200 },
      { day: "Wed", amount: 4800 },
      { day: "Thu", amount: 6000 },
      { day: "Fri", amount: 8400 },
      { day: "Sat", amount: 9600 },
      { day: "Sun", amount: 4200 }
    ],
    transactions: [
      {
        id: "TX-8910",
        vehicleId: "VHC-8829-XL",
        description: "Bulk Fuel Supply Depot",
        category: "FUEL",
        date: "Sep 15, 2023 &bull; 02:30 PM",
        rawDate: "2023-09-15T14:30:00",
        amount: 2400.00,
        items: [
          { name: "Bulk Diesel Fuel Refill", qty: "1600 L", cost: 2400.00 }
        ]
      },
      {
        id: "TX-9021",
        vehicleId: "VHC-8829-XL",
        description: "Shell Gas Station - Munich North",
        category: "FUEL",
        date: "Oct 24, 2023 &bull; 08:45 AM",
        rawDate: "2023-10-24T08:45:00",
        amount: 480.00,
        items: [
          { name: "Premium Diesel Fuel", qty: "320 L", cost: 450.00 },
          { name: "Windshield Washer Fluid", qty: "1", cost: 30.00 }
        ]
      },
      {
        id: "TX-9022",
        vehicleId: "VAN-4412-SM",
        description: "Electronic Toll Collection - A9 Hub",
        category: "TOLLS",
        date: "Oct 24, 2023 &bull; 11:20 AM",
        rawDate: "2023-10-24T11:20:00",
        amount: 22.50,
        items: [
          { name: "Standard Toll Pass - Class 2", qty: "1", cost: 22.50 }
        ]
      },
      {
        id: "TX-9023",
        vehicleId: "HDT-2022-RT",
        description: "Service Center #402 - Brake Check",
        category: "REPAIR",
        date: "Oct 23, 2023 &bull; 04:15 PM",
        rawDate: "2023-10-23T16:15:00",
        amount: 1250.00,
        items: [
          { name: "Front Rotors & Brake Pads Set", qty: "1", cost: 850.00 },
          { name: "Labor Hours - Calibration", qty: "4 hrs", cost: 400.00 }
        ]
      }
    ]
  },
  ytd: {
    totalOperationalCost: 1283220,
    trendChange: "5.1%",
    maintenanceCost: 291690,
    efficiencyScore: 85,
    cards: [
      {
        id: "VHC-8829-XL",
        vehicleId: "VHC-8829-XL",
        type: "Long-Haul Trailer",
        zone: "Zone A",
        status: "Active",
        usagePercentage: 62,
        limit: 144000,
        fuelCosts: 77046.00,
        tollsFees: 15360.00,
        icon: "local_shipping"
      },
      {
        id: "VAN-4412-SM",
        vehicleId: "VAN-4412-SM",
        type: "Last-Mile Delivery",
        zone: "Zone B",
        status: "Over Budget",
        usagePercentage: 96,
        limit: 54000,
        fuelCosts: 46081.20,
        tollsFees: 3602.40,
        icon: "delivery_dining"
      },
      {
        id: "HDT-2022-RT",
        vehicleId: "HDT-2022-RT",
        type: "Heavy Duty Trans",
        zone: "Regional",
        status: "Standby",
        usagePercentage: 40,
        limit: 300000,
        fuelCosts: 110640.00,
        tollsFees: 25320.00,
        icon: "fire_truck"
      }
    ],
    weeklyTrend: [
      { day: "Mon", amount: 10800 },
      { day: "Tue", amount: 21600 },
      { day: "Wed", amount: 14400 },
      { day: "Thu", amount: 18000 },
      { day: "Fri", amount: 25200 },
      { day: "Sat", amount: 28800 },
      { day: "Sun", amount: 12600 }
    ],
    transactions: [
      {
        id: "TX-7811",
        vehicleId: "HDT-2022-RT",
        description: "Tire Supply Co - Full Set replacement",
        category: "REPAIR",
        date: "Jun 12, 2023 &bull; 10:00 AM",
        rawDate: "2023-06-12T10:00:00",
        amount: 3200.00,
        items: [
          { name: "Heavy Duty All-Weather Tires", qty: "10", cost: 2800.00 },
          { name: "Mounting & Balancing Fees", qty: "1", cost: 400.00 }
        ]
      },
      {
        id: "TX-8910",
        vehicleId: "VHC-8829-XL",
        description: "Bulk Fuel Supply Depot",
        category: "FUEL",
        date: "Sep 15, 2023 &bull; 02:30 PM",
        rawDate: "2023-09-15T14:30:00",
        amount: 2400.00,
        items: [
          { name: "Bulk Diesel Fuel Refill", qty: "1600 L", cost: 2400.00 }
        ]
      },
      {
        id: "TX-9021",
        vehicleId: "VHC-8829-XL",
        description: "Shell Gas Station - Munich North",
        category: "FUEL",
        date: "Oct 24, 2023 &bull; 08:45 AM",
        rawDate: "2023-10-24T08:45:00",
        amount: 480.00,
        items: [
          { name: "Premium Diesel Fuel", qty: "320 L", cost: 450.00 },
          { name: "Windshield Washer Fluid", qty: "1", cost: 30.00 }
        ]
      },
      {
        id: "TX-9022",
        vehicleId: "VAN-4412-SM",
        description: "Electronic Toll Collection - A9 Hub",
        category: "TOLLS",
        date: "Oct 24, 2023 &bull; 11:20 AM",
        rawDate: "2023-10-24T11:20:00",
        amount: 22.50,
        items: [
          { name: "Standard Toll Pass - Class 2", qty: "1", cost: 22.50 }
        ]
      },
      {
        id: "TX-9023",
        vehicleId: "HDT-2022-RT",
        description: "Service Center #402 - Brake Check",
        category: "REPAIR",
        date: "Oct 23, 2023 &bull; 04:15 PM",
        rawDate: "2023-10-23T16:15:00",
        amount: 1250.00,
        items: [
          { name: "Front Rotors & Brake Pads Set", qty: "1", cost: 850.00 },
          { name: "Labor Hours - Calibration", qty: "4 hrs", cost: 400.00 }
        ]
      }
    ]
  }
};

const STORAGE_KEY = "transitops_expense_overview";

const getOverviewStored = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_OVERVIEW_DATA;
  } catch (e) {
    return DEFAULT_OVERVIEW_DATA;
  }
};

const setOverviewStored = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
};

// Initialize if empty
if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
  setOverviewStored(DEFAULT_OVERVIEW_DATA);
}

export const expenseService = {
  // Get overview data for a specific interval
  getOverview: async (interval = 'monthly') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allData = getOverviewStored();
        const intervalKey = interval.toLowerCase();
        resolve(allData[intervalKey] || allData.monthly);
      }, 200);
    });
  }
};
