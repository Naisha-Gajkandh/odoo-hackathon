import React, { useState, useRef, useEffect } from 'react';

const ProfileMenu = ({ currentRole, currentEmail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = currentRole === 'Dispatcher' ? 'Krisha Vaghani' : 'Naisha Gajkandh';
  const displayEmail = currentEmail || (currentRole === 'Dispatcher' ? 'krisha@transitops.co' : 'manager@transitops.co');
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}&backgroundColor=e63946`;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-secondary-container transition-all duration-200 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0 bg-secondary-container">
          <img
            className="w-full h-full object-cover"
            alt={displayName}
            src={avatarUrl}
          />
        </div>
        <div className="text-left hidden md:block pr-2">
          <p className="text-xs font-bold text-primary leading-tight">{displayName}</p>
          <p className="text-[10px] text-secondary uppercase font-semibold leading-none">{currentRole || 'Operations'}</p>
        </div>
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-xl shadow-lg z-50 py-2 origin-top-right transform transition-all scale-100 opacity-100 duration-200">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-bold text-primary">{displayName}</p>
            <p className="text-xs text-secondary truncate">{displayEmail}</p>
            <span className="inline-block mt-2 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {currentRole || 'Guest'}
            </span>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                alert('Profile settings screen coming soon!');
              }}
              className="w-full text-left px-4 py-2 text-xs text-secondary hover:bg-secondary-container hover:text-primary flex items-center gap-2.5 transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                alert('Help Center coming soon!');
              }}
              className="w-full text-left px-4 py-2 text-xs text-secondary hover:bg-secondary-container hover:text-primary flex items-center gap-2.5 transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span>Help & Support</span>
            </button>
          </div>

          <div className="border-t border-border pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-error hover:bg-error-container/20 flex items-center gap-2.5 transition-colors font-bold focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
