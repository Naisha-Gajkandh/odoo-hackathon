import React from 'react';

const LicenseCard = ({ license }) => {
  if (!license) return null;

  const isExpired = license.status?.toLowerCase() === 'expired';

  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="font-bold text-sm text-primary mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-transit-blue text-[20px]">credit_card</span>
        Commercial Driver License (CDL)
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
        <div className="p-3.5 bg-background rounded-xl border border-border/40">
          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Document Number</p>
          <p className="text-sm font-bold text-primary">{license.documentNumber}</p>
        </div>
        
        <div className="p-3.5 bg-background rounded-xl border border-border/40">
          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Class Type</p>
          <p className="text-sm font-bold text-primary">{license.classType}</p>
        </div>
        
        <div className="p-3.5 bg-background rounded-xl border border-border/40">
          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Issue Date</p>
          <p className="text-sm font-bold text-primary">{license.issueDate}</p>
        </div>
        
        <div className="p-3.5 bg-background rounded-xl border border-border/40">
          <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Expiration Date</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-primary">{license.expiryDate}</p>
            {isExpired ? (
              <span className="text-[10px] bg-error-container text-error px-2 py-0.5 rounded font-bold uppercase">Expired</span>
            ) : (
              <span className="text-[10px] bg-transit-blue-container text-transit-blue px-2 py-0.5 rounded font-bold uppercase">Valid</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Endorsements */}
      {license.endorsements && license.endorsements.length > 0 && (
        <div className="mt-8">
          <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">Endorsements</h4>
          <div className="flex flex-wrap gap-2.5">
            {license.endorsements.map((endorsement, index) => (
              <span
                key={index}
                className="bg-secondary-container px-3.5 py-2 rounded-xl text-xs font-bold text-on-secondary-container flex items-center gap-2 border border-border"
              >
                <span className="material-symbols-outlined text-[16px] text-transit-blue">
                  {endorsement.icon}
                </span>
                {endorsement.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseCard;
