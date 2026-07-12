import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { authService } from './services/tripService';
import PageLayout from './components/PageLayout';
import TripDispatch from './pages/TripDispatch';
import VehicleRegistry from './pages/VehicleRegistry';
import DriverManagement from './pages/DriverManagement';
import Analytics from './pages/Analytics';
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Trip Management');

  // Check auth status on mount
  useEffect(() => {
    const authed = authService.isAuthenticated();
    setIsAuthenticated(authed);
    if (authed) {
      setRole(authService.getCurrentRole());
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setRole(authService.getCurrentRole());
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRole(null);
  };

  const handleMenuSelect = (menuName) => {
    if (
      menuName === 'Trip Management' ||
      menuName === 'Vehicle Registry' ||
      menuName === 'Driver Management' ||
      menuName === 'Reports' ||
      menuName === 'Maintenance' ||
      menuName === 'Fuel & Expenses'
    ) {
      setActiveTab(menuName);
    } else {
      toast(`Simulated view: ${menuName}`, {
        icon: 'ℹ️',
        style: {
          border: '1px solid #E5E7EB',
          padding: '12px 16px',
          color: '#111111',
          fontWeight: 'bold',
          borderRadius: '12px',
        }
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" reverseOrder={false} />
      </>
    );
  }

  const getPageConfig = () => {
    if (activeTab === 'Vehicle Registry') {
      return {
        title: "Vehicle Registry",
        breadcrumbs: ["Operations", "Vehicles"]
      };
    }
    if (activeTab === 'Driver Management') {
      return {
        title: "Driver Management",
        breadcrumbs: ["Operations", "Drivers"]
      };
    }
    if (activeTab === 'Reports') {
      return {
        title: "Reports & Analytics",
        breadcrumbs: ["Operations", "Reports"]
      };
    }
    if (activeTab === 'Maintenance') {
      return {
        title: "Maintenance Logs",
        breadcrumbs: ["Operations", "Maintenance"]
      };
    }
    if (activeTab === 'Fuel & Expenses') {
      return {
        title: "Fuel & Expense Management",
        breadcrumbs: ["Operations", "Financials"]
      };
    }
    return {
      title: "Trip Management",
      breadcrumbs: ["Operations", "Trips"]
    };
  };

  const pageConfig = getPageConfig();

  return (
    <PageLayout
      title={pageConfig.title}
      breadcrumbs={pageConfig.breadcrumbs}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentRole={role}
      currentEmail={authService.getCurrentEmail()}
      onLogout={handleLogout}
      activeMenu={activeTab}
      onMenuSelect={handleMenuSelect}
    >
      {/* Main Active Page Component */}
      {activeTab === 'Trip Management' ? (
        <TripDispatch
          searchQuery={searchQuery}
          currentRole={role}
        />
      ) : activeTab === 'Vehicle Registry' ? (
        <VehicleRegistry
          searchQuery={searchQuery}
        />
      ) : activeTab === 'Driver Management' ? (
        <DriverManagement
          searchQuery={searchQuery}
        />
      ) : activeTab === 'Reports' ? (
        <Analytics
          searchQuery={searchQuery}
        />
      ) : activeTab === 'Maintenance' ? (
        <Maintenance
          searchQuery={searchQuery}
        />
      ) : activeTab === 'Fuel & Expenses' ? (
        <FuelExpenses 
          searchQuery={searchQuery} 
        />
      ) : null}

      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontFamily: 'Manrope, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            background: '#ffffff',
            color: '#111111'
          }
        }}
      />
    </PageLayout>
  );
}

export default App;
