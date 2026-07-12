import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data }) => {
  const [timeframe, setTimeframe] = useState('Monthly'); // Weekly or Monthly

  const chartData = data[timeframe] || [];

  // Format currency for Y-axis and Tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border p-4 rounded-xl shadow-lg font-headline-md text-[12px] select-none">
          <p className="font-black text-primary mb-1.5">{timeframe === 'Weekly' ? `Week ${label}` : label}</p>
          <div className="space-y-1">
            <p className="text-transit-blue font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-transit-blue rounded-full"></span>
              Current: {formatCurrency(payload[0].value)}
            </p>
            {payload[1] && (
              <p className="text-secondary font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-outline rounded-full"></span>
                Previous: {formatCurrency(payload[1].value)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl border border-border soft-shadow flex flex-col gap-6">
      <div className="flex justify-between items-center select-none">
        <h3 className="font-headline-md text-headline-md text-primary font-black">Revenue Growth Analysis</h3>
        <div className="flex bg-secondary-container p-1 rounded-xl">
          {['Weekly', 'Monthly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`font-headline-md px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-200 ${
                timeframe === tf
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLastPeriod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold', fontFamily: 'Manrope, sans-serif' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold', fontFamily: 'Manrope, sans-serif' }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563EB" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }}
            />
            <Area 
              type="monotone" 
              dataKey="lastPeriod" 
              stroke="#9CA3AF" 
              strokeWidth={2} 
              strokeDasharray="4 4"
              fillOpacity={1} 
              fill="url(#colorLastPeriod)" 
              activeDot={{ r: 4, strokeWidth: 0, fill: '#9CA3AF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
