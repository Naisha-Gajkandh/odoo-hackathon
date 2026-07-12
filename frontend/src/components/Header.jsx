import React from 'react';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';

const Header = ({ 
  title = "Trip Management", 
  breadcrumbs = ["Operations", "Trips"], 
  searchQuery, 
  setSearchQuery, 
  currentRole, 
  currentEmail, 
  onLogout,
  onMenuToggle // For mobile navigation drawer toggling
}) => {
  return (
    <header className="sticky top-0 right-0 left-0 h-[72px] bg-white border-b border-border flex items-center justify-between px-6 z-40">
      
      {/* Left: Breadcrumbs & Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-secondary hover:bg-secondary-container hover:text-primary transition-colors focus:outline-none"
          title="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex flex-col">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-secondary uppercase tracking-widest leading-none mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[9px] text-outline opacity-70">/</span>}
                <span>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
          {/* Page Title */}
          <h1 className="font-headline-md text-headline-md font-black text-primary text-xl leading-tight">
            {title}
          </h1>
        </div>
      </div>
      
      {/* Right: Search, Notification, Help, Profile */}
      <div className="flex items-center gap-5">
        {/* Search Bar - hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:block">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        
        {/* Notification Button */}
        <button className="relative p-2 rounded-xl text-secondary hover:bg-secondary-container hover:text-primary transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        
        {/* Help Button */}
        <button className="p-2 rounded-xl text-secondary hover:bg-secondary-container hover:text-primary transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95 hidden md:block">
          <span className="material-symbols-outlined text-[22px]">help</span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-1"></div>

        {/* Profile Dropdown Menu */}
        <ProfileMenu 
          currentRole={currentRole} 
          currentEmail={currentEmail} 
          onLogout={onLogout} 
        />
      </div>
    </header>
  );
};

export default Header;
