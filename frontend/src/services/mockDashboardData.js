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
      driver: 'Amit Patel',
      eta: '45 min',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80',
      imageAlt: 'Heavy Duty Truck',
    },
    {
      id: 'TR002',
      status: 'Completed',
      statusColor: 'success',
      vehicleCode: 'TRK-12',
      vehicleName: 'Sprinter',
      driver: 'Shreya Goswami',
      eta: 'Arrived',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80',
      imageAlt: 'Delivery Van',
    },
    {
      id: 'TR003',
      status: 'Dispatched',
      statusColor: 'info',
      vehicleCode: 'MINI-08',
      vehicleName: 'Scania',
      driver: 'Martin Parmar',
      eta: '1h 10m',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80',
      imageAlt: 'Motorcycle Courier',
    },
    {
      id: 'TR004',
      status: 'Draft',
      statusColor: 'neutral',
      vehicleCode: 'VAN-12',
      vehicleName: 'Ford Transit',
      driver: 'Arjun Joshi',
      eta: 'Pending',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80',
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
