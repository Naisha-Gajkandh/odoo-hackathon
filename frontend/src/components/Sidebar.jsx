import React from 'react';
import NavigationItem from './NavigationItem';

const Sidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isDrawerOpen, 
  setIsDrawerOpen, 
  activeMenu = "Trip Management",
  onMenuSelect 
}) => {
  const menuItems = [
    { icon: 'dashboard', label: 'Dashboard' },
    { icon: 'local_shipping', label: 'Vehicle Registry' },
    { icon: 'person', label: 'Driver Management' },
    { icon: 'route', label: 'Trip Management' },
    { icon: 'build', label: 'Maintenance' },
    { icon: 'local_gas_station', label: 'Fuel & Expenses' },
    { icon: 'analytics', label: 'Reports' },
    { icon: 'settings', label: 'Settings' },
  ];

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (label) => {
    if (onMenuSelect) {
      onMenuSelect(label);
    }
    // Close drawer on mobile after selection
    setIsDrawerOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-border py-6">
      
      {/* Sidebar Header: Logo & Manual Collapse Toggle Button */}
      {isCollapsed ? (
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Logo */}
          <div className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm">
            T
          </div>
          {/* Toggle Chevron (Image 1) */}
          <button 
            onClick={handleToggle}
            className="flex p-1.5 rounded-lg text-secondary hover:bg-secondary-container hover:text-primary transition-colors focus:outline-none"
            title="Expand Sidebar"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">
              chevron_right
            </span>
          </button>
        </div>
      ) : (
        <div className="px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm">
              T
            </div>
            <span 
              className="font-headline-md font-black text-primary text-lg transition-all duration-300 whitespace-nowrap"
            >
              TransitOps
            </span>
          </div>

          {/* Collapse Toggle button */}
          <button 
            onClick={handleToggle}
            className="hidden md:flex p-1.5 rounded-lg text-secondary hover:bg-secondary-container hover:text-primary transition-colors focus:outline-none"
            title="Collapse Sidebar"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">
              chevron_left
            </span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-2 space-y-1.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <NavigationItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={activeMenu === item.label}
            isCollapsed={isCollapsed}
            onClick={() => handleItemClick(item.label)}
          />
        ))}
      </div>

      <div className="px-4 mt-6 pt-4 border-t border-border space-y-4">
        
        {/* Create New Request Button */}
        {!isCollapsed ? (
          <button 
            onClick={() => alert('New request initialization coming soon!')}
            className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-xl text-xs hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            <span>Create New Request</span>
          </button>
        ) : (
          <button 
            onClick={() => alert('New request initialization coming soon!')}
            className="w-11 h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center mx-auto hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm focus:outline-none"
            title="Create New Request"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">add</span>
          </button>
        )}

        {/* User Card */}
        <div className={`flex items-center gap-3 p-1.5 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0 bg-secondary-container">
            <img 
              className="w-full h-full object-cover" 
              alt="George Davidson"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtlXpImn4B2hQxA0A3_V9kkXPEvJ_0yE22RDB-6YO9swd8l2QhWoCZ_ezbzfcUGKLsw7dRQu8kZ0gQQwzAfaiJ01YuU-G5HJB4qWLdQn1d4sdGyv6fNLGbTtD4Mv3IBmZxKoDHrnKVg-hZf8MXAL9VHWs5CEbnZR_cXbuTk7Z_MTp04RHpwcaX-YnCSzZwrILBT5yabO_rX9P9HAhdjlx_xhkpv9twxMD6tmMtREOHN5P1CE1IQieb"
            />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden min-w-0">
              <p className="text-xs font-bold text-primary truncate">George Davidson</p>
              <p className="text-[10px] text-secondary truncate">george.davidson@email.com</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Sidebar (fixed rail layout) */}
      <aside 
        className={`hidden lg:block fixed left-0 top-0 h-screen bg-white z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[230px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Navigation Drawer (hidden by default, slides on hamburger click) */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsDrawerOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        {/* Slide-in drawer container */}
        <aside 
          className={`absolute left-0 top-0 bottom-0 h-full w-[230px] bg-white transition-transform duration-300 ease-out ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
