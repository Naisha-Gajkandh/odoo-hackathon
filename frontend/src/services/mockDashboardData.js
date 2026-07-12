/**
 * Mock data for the Dashboard page.
 * Follows the same pattern as mockAnalyticsData.js — pure JS objects, no API calls.
 */

export const mockDashboardData = {
  // ── KPI row (7 cards, matching the HTML prototype) ──
  kpis: [
    { id: 'active-vehicles',    label: 'Active Vehicles',     value: '53', borderColor: 'border-success-green', iconName: 'Truck' },
    { id: 'available-vehicles', label: 'Available Vehicles',  value: '42', borderColor: 'border-success-green', iconName: 'CheckCircle2' },
    { id: 'vehicles-maint',     label: 'Vehicles in Maint.',  value: '05', borderColor: 'border-warning-orange', iconName: 'Wrench' },
    { id: 'active-trips',       label: 'Active Trips',        value: '18', borderColor: 'border-success-green', iconName: 'Route' },
    { id: 'pending-trips',      label: 'Pending Trips',       value: '09', borderColor: 'border-primary', iconName: 'Clock' },
    { id: 'drivers-on-duty',    label: 'Drivers On Duty',     value: '26', borderColor: 'border-primary', iconName: 'UserCheck' },
    { id: 'fleet-utilization',  label: 'Fleet Utilization',   value: '81%', borderColor: 'border-success-green', iconName: 'TrendingUp' },
  ],

  // ── Recent Trip cards ──
  recentTrips: [
    {
      id: 'TR001',
      status: 'On Trip',
      statusColor: 'info',
      vehicleCode: 'VAN-05',
      vehicleName: 'Volvo FH16',
      driver: 'Alex Johnson',
      eta: '45 min',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQFHYzqtenubwBKWT-sSZlKaXkbunJTtFeF1XBRvqXSRS5Z4bKfLx5v-DbAYy5oaiOs_WJucSUNmnafdVZ3qk0pFleGkKQjQWHbyWv1QZyeAf5WEbt58j4-D2NQkCJPJYW1E7eDtAw9-qj-kKRdbgZPb19I-Uv9Sr9bLKC_0Rhf_yVVTB3daP964ORK6ocQQ-00qZ0U8dCBbW28eGrQj6ekV8WhO_stGQ0aaXY3attaOFFv8zcq7LJ',
      imageAlt: 'Heavy Duty Truck',
    },
    {
      id: 'TR002',
      status: 'Completed',
      statusColor: 'success',
      vehicleCode: 'TRK-12',
      vehicleName: 'Sprinter',
      driver: 'Sarah Williams',
      eta: 'Arrived',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKNQUPFvj5JslS8P4jHZxxk5KtEHEP2uQy7GIkV5q15t_aS-nwejNK2mq_oRCqxB0kZeuxDZ8eKkM8w_tVg32ksPX7CohDF8DpqL7dANPpNR-XPHIZC3hwJJ91mrmh4EoPhMKURVSgXEIhONGmX6iYWqjaJMNjnq52_I7bRUME-hk2tiY4zosVFapx9q2OIQpTx3zpUd9bg5DQgo0wLWkPqsygp5r-cbRSjfU30nydewF_s9LvcI9k',
      imageAlt: 'Delivery Van',
    },
    {
      id: 'TR003',
      status: 'Dispatched',
      statusColor: 'info',
      vehicleCode: 'MINI-08',
      vehicleName: 'Scania',
      driver: 'James Brown',
      eta: '1h 10m',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7g2NxmPXy-2mKUeCQj4Ha0t5SYuxyX7noZA0Whdhfpj9goVlLaVmwDaBUj_bFdCAKxoNLhPYuaxxEaKaGHsRVZPz8sIFj4exBGf_HSGHiPN7WQP0FCuZhXw4yeHZPyhsYlkVhov8btno2Y0399fIs8IQ5XFtMUGssOTmY8q9WKHcUqNe5uWgL3ZGLG3XSZaSsT46ylEvnDCXNmRrOno3w_AySycfX3DFX_l7H60HTjZNMbdq9NhNS',
      imageAlt: 'Motorcycle Courier',
    },
    {
      id: 'TR004',
      status: 'Draft',
      statusColor: 'neutral',
      vehicleCode: 'VAN-12',
      vehicleName: 'Ford Transit',
      driver: 'Alex Martinez',
      eta: 'Pending',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKNQUPFvj5JslS8P4jHZxxk5KtEHEP2uQy7GIkV5q15t_aS-nwejNK2mq_oRCqxB0kZeuxDZ8eKkM8w_tVg32ksPX7CohDF8DpqL7dANPpNR-XPHIZC3hwJJ91mrmh4EoPhMKURVSgXEIhONGmX6iYWqjaJMNjnq52_I7bRUME-hk2tiY4zosVFapx9q2OIQpTx3zpUd9bg5DQgo0wLWkPqsygp5r-cbRSjfU30nydewF_s9LvcI9k',
      imageAlt: 'Delivery Van',
    },
  ],

  // ── Vehicle Status breakdown ──
  vehicleStatus: [
    { label: 'Available', count: 42, percent: 75, color: 'bg-success-green' },
    { label: 'On Trip',   count: 18, percent: 35, color: 'bg-success-green' },
    { label: 'In Shop',   count:  5, percent: 10, color: 'bg-warning-orange' },
    { label: 'Retired',   count:  2, percent:  5, color: 'bg-outline-variant' },
  ],

  // ── Quick Actions ──
  quickActions: [
    {
      icon: 'add_location_alt',
      title: 'Create Trip',
      description: 'Plan new routes',
    },
    {
      icon: 'build_circle',
      title: 'Log Maintenance',
      description: 'Track vehicle repairs',
    },
  ],

  // ── Live Operations Map metrics ──
  mapMetrics: {
    avgFleetSpeed: '68 MPH',
    activeRoutes: '12',
    alertStatus: 'NORMAL',
    mapImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnOIEbkRG70-kK4Ye6pCRqIUe0knhsuHLgLicmakfarhNLWN_y-_-F7TdhGmWG1V_UczFKEywKEVCEm3k0DEzlkm5CX2XFWE5vtP2WmN5YHhJ9UqjKFQVhg4WzztYoDls8gtXvB5NklBWGe4O-G6I3a7MsLuEkXbMdv2JKUm0UZVFYYrp7TXUEuIpCuVMwVyBS8Ns1wouLRunhOIcM0bhHRJjEb1op2JXKLRu4BmpmaKFGbySNH3nV",
  },

  // ── Filter options ──
  filters: {
    vehicleTypes: ['Vehicle Type: All', 'Trucks', 'Vans', 'Motorcycles'],
    statuses: ['Status: All', 'Active', 'Available', 'In Maintenance', 'Retired'],
    regions: ['Region: All', 'North', 'South', 'East', 'West'],
  },
};
