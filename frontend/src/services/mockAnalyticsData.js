// Mock Data for Reports & Analytics

export const mockAnalyticsData = {
  // Pre-configured data based on selected date ranges
  kpis: {
    'Last 7 Days': [
      {
        id: 'revenue',
        title: 'Weekly Revenue',
        value: '$105,200',
        change: '+15%',
        trend: 'up',
        icon: 'payments',
        iconBg: 'bg-success-green-container text-on-success-green'
      },
      {
        id: 'active_fleet',
        title: 'Active Fleet',
        value: '138 / 150',
        change: '-2%',
        trend: 'down',
        icon: 'local_shipping',
        iconBg: 'bg-secondary-container text-on-secondary-container'
      },
      {
        id: 'avg_delivery',
        title: 'Avg. Delivery Time',
        value: '2.9 Hrs',
        change: '-0.5h',
        trend: 'up', // in courier terms, down delivery time is good trend (up efficiency)
        icon: 'timer',
        iconBg: 'bg-warning-orange-container text-on-warning-orange'
      },
      {
        id: 'fuel',
        title: 'Fuel Consumption',
        value: '23.8 L/100km',
        change: '-1.2%',
        trend: 'stable',
        icon: 'gas_meter',
        iconBg: 'bg-transit-blue-container text-transit-blue'
      }
    ],
    'Last 30 Days': [
      {
        id: 'revenue',
        title: 'Monthly Revenue',
        value: '$452,000',
        change: '+8%',
        trend: 'up',
        icon: 'payments',
        iconBg: 'bg-success-green-container text-on-success-green'
      },
      {
        id: 'active_fleet',
        title: 'Active Fleet',
        value: '144 / 150',
        change: '+1%',
        trend: 'up',
        icon: 'local_shipping',
        iconBg: 'bg-secondary-container text-on-secondary-container'
      },
      {
        id: 'avg_delivery',
        title: 'Avg. Delivery Time',
        value: '3.1 Hrs',
        change: '-0.2h',
        trend: 'up',
        icon: 'timer',
        iconBg: 'bg-warning-orange-container text-on-warning-orange'
      },
      {
        id: 'fuel',
        title: 'Fuel Consumption',
        value: '24.2 L/100km',
        change: 'Stable',
        trend: 'stable',
        icon: 'gas_meter',
        iconBg: 'bg-transit-blue-container text-transit-blue'
      }
    ],
    'This Month': [
      {
        id: 'revenue',
        title: 'Monthly Revenue',
        value: '$428,500',
        change: '12%',
        trend: 'up',
        icon: 'payments',
        iconBg: 'bg-success-green-container text-on-success-green'
      },
      {
        id: 'active_fleet',
        title: 'Active Fleet',
        value: '142 / 150',
        change: '3%',
        trend: 'down',
        icon: 'local_shipping',
        iconBg: 'bg-secondary-container text-on-secondary-container'
      },
      {
        id: 'avg_delivery',
        title: 'Avg. Delivery Time',
        value: '3.2 Hrs',
        change: '0.4h',
        trend: 'up',
        icon: 'timer',
        iconBg: 'bg-warning-orange-container text-on-warning-orange'
      },
      {
        id: 'fuel',
        title: 'Fuel Consumption',
        value: '24.5 L/100km',
        change: 'Stable',
        trend: 'stable',
        icon: 'gas_meter',
        iconBg: 'bg-transit-blue-container text-transit-blue'
      }
    ],
    'This Quarter': [
      {
        id: 'revenue',
        title: 'Quarterly Revenue',
        value: '$1,280,000',
        change: '+18%',
        trend: 'up',
        icon: 'payments',
        iconBg: 'bg-success-green-container text-on-success-green'
      },
      {
        id: 'active_fleet',
        title: 'Active Fleet',
        value: '140 / 150',
        change: '+5%',
        trend: 'up',
        icon: 'local_shipping',
        iconBg: 'bg-secondary-container text-on-secondary-container'
      },
      {
        id: 'avg_delivery',
        title: 'Avg. Delivery Time',
        value: '3.4 Hrs',
        change: '+0.1h',
        trend: 'down',
        icon: 'timer',
        iconBg: 'bg-warning-orange-container text-on-warning-orange'
      },
      {
        id: 'fuel',
        title: 'Fuel Consumption',
        value: '24.8 L/100km',
        change: 'Stable',
        trend: 'stable',
        icon: 'gas_meter',
        iconBg: 'bg-transit-blue-container text-transit-blue'
      }
    ]
  },

  // Revenue chart data
  revenueGrowth: {
    Weekly: [
      { name: 'W1', revenue: 95000, lastPeriod: 88000 },
      { name: 'W2', revenue: 110000, lastPeriod: 102000 },
      { name: 'W3', revenue: 108000, lastPeriod: 105000 },
      { name: 'W4', revenue: 115500, lastPeriod: 101000 }
    ],
    Monthly: [
      { name: 'Jan', revenue: 180000, lastPeriod: 150000 },
      { name: 'Feb', revenue: 240000, lastPeriod: 190000 },
      { name: 'Mar', revenue: 210000, lastPeriod: 220000 },
      { name: 'Apr', revenue: 320000, lastPeriod: 280000 },
      { name: 'May', revenue: 390000, lastPeriod: 310000 },
      { name: 'Jun', revenue: 428500, lastPeriod: 320000 }
    ]
  },

  // Cost breakdown top vehicles
  costBreakdown: [
    { id: 'TRK-8829', label: 'TRK-8829', cost: 12450, percentage: 95, type: 'Heavy Freight (Class 8)', status: 'Active', category: 'Maintenance' },
    { id: 'TRK-2241', label: 'TRK-2241', cost: 9200, percentage: 75, type: 'Heavy Freight (Class 8)', status: 'Active', category: 'Fuel' },
    { id: 'VAN-9012', label: 'VAN-9012', cost: 6150, percentage: 55, type: 'Last-Mile Delivery', status: 'Active', category: 'Fuel' },
    { id: 'TRK-5501', label: 'TRK-5501', cost: 4800, percentage: 40, type: 'Heavy Freight (Class 8)', status: 'Active', category: 'Tolls' },
    { id: 'VAN-1122', label: 'VAN-1122', cost: 3200, percentage: 25, type: 'Last-Mile Delivery', status: 'In Shop', category: 'Maintenance' },
    { id: 'TRK-4412', label: 'TRK-4412', cost: 2800, percentage: 22, type: 'Heavy Freight (Class 8)', status: 'Active', category: 'Tolls' },
    { id: 'VAN-3390', label: 'VAN-3390', cost: 1900, percentage: 15, type: 'Last-Mile Delivery', status: 'Active', category: 'Driver' }
  ],

  // Map Hub locations
  mapHubs: [
    { name: 'Chicago', activeVehicles: 12, temp: '4°C', tempStatus: 'OK', avgSpeed: '68 km/h', shipments: 4, score: '94%', x: '45%', y: '35%' },
    { name: 'New York', activeVehicles: 18, temp: '5°C', tempStatus: 'OK', avgSpeed: '52 km/h', shipments: 9, score: '89%', x: '82%', y: '28%' },
    { name: 'Houston', activeVehicles: 8, temp: '6°C', tempStatus: 'OK', avgSpeed: '70 km/h', shipments: 2, score: '95%', x: '35%', y: '80%' },
    { name: 'Seattle', activeVehicles: 6, temp: '3°C', tempStatus: 'OK', avgSpeed: '58 km/h', shipments: 3, score: '88%', x: '10%', y: '12%' },
    { name: 'Los Angeles', activeVehicles: 15, temp: '8°C', tempStatus: 'OK', avgSpeed: '61 km/h', shipments: 6, score: '92%', x: '8%', y: '58%' }
  ],

  // Fleet capacity records
  fleetCapacity: [
    {
      id: 'heavy_freight',
      title: 'Heavy Freight (Class 8)',
      description: 'High demand on interstate corridors.',
      status: 'Optimal',
      fill: 82,
      badgeStyle: 'text-transit-blue bg-transit-blue-container',
      fillBg: 'bg-transit-blue-container/40 border-transit-blue',
      fillColor: 'text-transit-blue',
      imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzy-tmcx9lI0rIGihEHnS1GhGyXflnmaYejtQiR7rGYB9YuZlSM37Ar3BnedKTfWoBFj44LnZNUIUdieCH9OB9GinlmV3q94McXw5Lg_CmiggeihfP3hXpIU2fLC7nJ9iEyanvMlwIxsNGkcScT45fHgvlw7DALkf7Ndht7P-Ny3vUjEIyrGYOafAoiIRgnRXJXjcJW2tQIjEQKTab6tEL-4yzoYUcDR30R0F1q-PoicnWugpMoGfl'
    },
    {
      id: 'last_mile',
      title: 'Last-Mile Delivery',
      description: 'Available for immediate urban dispatch.',
      status: 'Underutilized',
      fill: 45,
      badgeStyle: 'text-on-secondary-container bg-secondary-container',
      fillBg: 'bg-warning-orange-container/30 border-warning-orange',
      fillColor: 'text-on-warning-orange',
      imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJqHqe57D6OJZL3aYr0x5Nx9N3vO6BBU1JGOUgugxeK817IL_XKCxfq7tRk6eFn4QktuVHKVB0RpZ7FxE2GnKYsQm3-3cxmb81moOsAGO2lm5Tcx9S5fKAo3k_qgQG6AKwBDIKtsJbUkZx2DmwNtPJZspmqrVYLGyeX6RQXc0suuo-T_4wWFSGfSFZ2GK8EPebjbo-8Kecg8KH3ksFHq11ND_Rq-tyl1ILiM7ZXWE5v8lHX9Zgkmgr'
    }
  ],

  // Detailed data tables for Financials and Fuel reports
  tables: {
    Financials: [
      { vehicleId: 'TRK-8829', distance: '12,450 km', fuelCost: '$4,108', maintenance: '$5,250', tolls: '$1,092', driverWage: '$2,000', total: '$12,450' },
      { vehicleId: 'TRK-2241', distance: '9,800 km', fuelCost: '$3,800', maintenance: '$1,900', tolls: '$700', driverWage: '$2,800', total: '$9,200' },
      { vehicleId: 'VAN-9012', distance: '6,200 km', fuelCost: '$2,150', maintenance: '$400', tolls: '$100', driverWage: '$3,500', total: '$6,150' },
      { vehicleId: 'TRK-5501', distance: '4,500 km', fuelCost: '$1,800', maintenance: '$900', tolls: '$600', driverWage: '$1,500', total: '$4,800' },
      { vehicleId: 'VAN-1122', distance: '3,800 km', fuelCost: '$1,200', maintenance: '$1,100', tolls: '$100', driverWage: '$800', total: '$3,200' }
    ],
    FuelEfficiency: [
      { vehicleId: 'TRK-8829', type: 'Class 8 Truck', distance: '12,450 km', fuelConsumed: '3,112 L', avgEfficiency: '25.0 L/100km', carbon: '8.1 tons', status: 'Optimal' },
      { vehicleId: 'TRK-2241', type: 'Class 8 Truck', distance: '9,800 km', fuelConsumed: '2,548 L', avgEfficiency: '26.0 L/100km', carbon: '6.6 tons', status: 'Alert' },
      { vehicleId: 'VAN-9012', type: 'Delivery Van', distance: '6,200 km', fuelConsumed: '744 L', avgEfficiency: '12.0 L/100km', carbon: '1.9 tons', status: 'Optimal' },
      { vehicleId: 'TRK-5501', type: 'Class 8 Truck', distance: '4,500 km', fuelConsumed: '1,080 L', avgEfficiency: '24.0 L/100km', carbon: '2.8 tons', status: 'Optimal' },
      { vehicleId: 'VAN-1122', type: 'Delivery Van', distance: '3,800 km', fuelConsumed: '494 L', avgEfficiency: '13.0 L/100km', carbon: '1.3 tons', status: 'Optimal' }
    ]
  },

  // Additional charts data for sub-views
  fuelTrends: [
    { day: 'Mon', Class8: 24.8, Van: 12.2 },
    { day: 'Tue', Class8: 24.2, Van: 12.0 },
    { day: 'Wed', Class8: 24.5, Van: 12.5 },
    { day: 'Thu', Class8: 25.1, Van: 12.1 },
    { day: 'Fri', Class8: 24.6, Van: 11.9 },
    { day: 'Sat', Class8: 23.9, Van: 11.7 },
    { day: 'Sun', Class8: 24.0, Van: 11.8 }
  ],

  costTrends: [
    { name: 'Fuel', value: 45000, color: '#2563EB' },
    { name: 'Maintenance', value: 28000, color: '#10B981' },
    { name: 'Driver Wages', value: 35000, color: '#F97316' },
    { name: 'Tolls & Fees', value: 12000, color: '#EF4444' }
  ],

  utilizationTrend: [
    { name: 'Week 1', active: 135, idle: 15 },
    { name: 'Week 2', active: 140, idle: 10 },
    { name: 'Week 3', active: 142, idle: 8 },
    { name: 'Week 4', active: 142, idle: 8 }
  ]
};
