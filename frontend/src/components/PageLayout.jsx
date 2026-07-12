import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const PageLayout = ({ 
  children, 
  title, 
  breadcrumbs, 
  searchQuery, 
  setSearchQuery, 
  currentRole, 
  currentEmail, 
  onLogout,
  activeMenu = "Trip Management",
  onMenuSelect
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Responsive sidebar collapse on window resize (tablet mode)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    // Initial call
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-background text-on-background font-body-md text-body-md flex">
      {/* Expanded/Collapsed Sidebar rail */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isDrawerOpen={isDrawerOpen} 
        setIsDrawerOpen={setIsDrawerOpen}
        activeMenu={activeMenu}
        onMenuSelect={onMenuSelect}
      />
      
      {/* Content wrapper taking up remaining horizontal space */}
      <div 
        className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[230px]'
        }`}
      >
        {/* sticky header */}
        <Header 
          title={title}
          breadcrumbs={breadcrumbs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentRole={currentRole}
          currentEmail={currentEmail}
          onLogout={onLogout}
          onMenuToggle={() => setIsDrawerOpen(true)}
        />
        
        {/* Inner Content Slot */}
        <div className="flex-1 flex flex-col page-fade-enter-active min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
