import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { expenseService } from '../services/expenseService';
import FuelExpenseCard from '../components/FuelExpenseCard';
import FuelExpenseChart from '../components/FuelExpenseChart';
import FuelExpenseTable from '../components/FuelExpenseTable';
import FuelExpenseDetailsModal from '../components/FuelExpenseDetailsModal';
import MaintenanceSkeleton from '../components/MaintenanceSkeleton';

const FuelExpenses = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState('monthly'); // monthly, quarterly, ytd
  const [data, setData] = useState(null);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('receipt'); // receipt, vehicle
  const [modalData, setModalData] = useState(null);

  const fetchExpenseData = async (selectedInterval) => {
    try {
      setLoading(true);
      const res = await expenseService.getOverview(selectedInterval);
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load expense records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseData(interval);
  }, [interval]);

  // Filter cards and transactions based on search query
  const getFilteredCards = () => {
    if (!data?.cards) return [];
    if (!searchQuery) return data.cards;
    const q = searchQuery.toLowerCase();
    return data.cards.filter(c => 
      c.vehicleId?.toLowerCase().includes(q) ||
      c.type?.toLowerCase().includes(q) ||
      c.zone?.toLowerCase().includes(q)
    );
  };

  const getFilteredTransactions = () => {
    if (!data?.transactions) return [];
    if (!searchQuery) return data.transactions;
    const q = searchQuery.toLowerCase();
    return data.transactions.filter(tx =>
      tx.vehicleId?.toLowerCase().includes(q) ||
      tx.description?.toLowerCase().includes(q) ||
      tx.category?.toLowerCase().includes(q)
    );
  };

  const handleViewVehicleDetails = (card) => {
    setModalMode('vehicle');
    setModalData(card);
    setModalOpen(true);
  };

  const handleViewReceipt = (tx) => {
    setModalMode('receipt');
    setModalData(tx);
    setModalOpen(true);
  };

  if (loading || !data) {
    return <MaintenanceSkeleton />;
  }

  const filteredCards = getFilteredCards();
  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Section with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-xl font-bold text-primary">Financial Overview</h2>
            <p className="text-xs text-secondary font-semibold">Monitoring fuel, tolls, and maintenance expenditures across the active fleet.</p>
          </div>
          
          {/* Large Stat Chip */}
          <div className="bg-primary text-on-primary px-8 py-5 rounded-2xl flex flex-col items-center md:items-end soft-shadow border border-white/10 select-none">
            <span className="font-bold uppercase tracking-wider text-[9px] opacity-75 mb-1">Total Operational Cost</span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-2xl font-black">${data.totalOperationalCost?.toLocaleString('en-US')}</span>
              <span className="text-[11px] font-bold text-success-green flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                {data.trendChange}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Controls */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4 flex-wrap gap-4 select-none">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-secondary-container/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold w-64" 
                placeholder="Search vehicle ID..." 
                type="text"
                disabled // Search is linked to the main header search bar!
                value={searchQuery || ''}
              />
            </div>
            <button 
              onClick={() => alert('Filters coming soon!')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container/60 hover:bg-secondary-container/90 text-xs font-bold text-primary transition-colors focus:outline-none border border-border/30"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>Filters</span>
            </button>
          </div>

          <div className="flex bg-secondary-container/50 p-1 rounded-xl border border-border/30">
            {['monthly', 'quarterly', 'ytd'].map((t) => (
              <button 
                key={t}
                onClick={() => setInterval(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none ${
                  interval === t 
                    ? 'bg-white text-primary soft-shadow' 
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid: Fuel & Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <FuelExpenseCard 
                key={card.id} 
                card={card} 
                onViewDetails={handleViewVehicleDetails}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-secondary text-xs italic bg-white border border-border rounded-2xl shadow-sm">
              No matching expense cards found.
            </div>
          )}
        </div>

        {/* Secondary Insight: Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bar Chart Weekly Trends */}
          <div className="lg:col-span-2">
            <FuelExpenseChart trendData={data.weeklyTrend} />
          </div>

          {/* Metric Card: Maintenance */}
          <div 
            onClick={() => alert('Navigating to Maintenance Logs...')}
            className="bg-secondary-container/20 rounded-2xl p-6 border border-border/40 flex flex-col justify-between group hover:bg-primary/5 transition-all cursor-pointer soft-shadow hover:shadow-md duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary soft-shadow">
              <span className="material-symbols-outlined text-[20px]">build_circle</span>
            </div>
            <div className="mt-8">
              <p className="font-bold text-[10px] text-secondary uppercase tracking-wider">Maintenance Cost</p>
              <h4 className="font-headline-md text-2xl font-black text-primary mt-1">
                ${data.maintenanceCost?.toLocaleString('en-US')}
              </h4>
              <p className="text-[10px] text-secondary mt-1.5">+12% from last month</p>
            </div>
          </div>

          {/* Metric Card: Efficiency */}
          <div 
            onClick={() => alert('Efficiency analytics analysis coming soon!')}
            className="bg-primary-container/10 rounded-2xl p-6 border border-border/40 flex flex-col justify-between group hover:opacity-90 transition-all cursor-pointer soft-shadow hover:shadow-md duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-transit-blue soft-shadow">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <div className="mt-8">
              <p className="font-bold text-[10px] text-on-transit-blue uppercase tracking-wider">Efficiency Score</p>
              <h4 className="font-headline-md text-2xl font-black text-transit-blue mt-1">
                {data.efficiencyScore}%
              </h4>
              <p className="text-[10px] text-on-transit-blue mt-1.5">Optimal route planning active</p>
            </div>
          </div>
        </div>

        {/* Detailed Transactions List */}
        <FuelExpenseTable 
          transactions={filteredTransactions} 
          onReceiptClick={handleViewReceipt}
        />

      </div>

      {/* Modal Popup Details */}
      <FuelExpenseDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        data={modalData}
      />
    </div>
  );
};

export default FuelExpenses;
