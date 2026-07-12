import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const FuelExpenseChart = ({ trendData }) => {
  if (!trendData || trendData.length === 0) return null;

  // Custom Tooltip component for premium styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-xl shadow-lg font-body-sm text-[11px]">
          <p className="font-bold text-primary">{payload[0].payload.day}</p>
          <p className="text-transit-blue font-bold mt-0.5">
            Spending: ${payload[0].value?.toLocaleString('en-US')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border/40 soft-shadow hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
      <div className="relative z-10">
        <h4 className="font-headline-md text-sm font-bold text-primary">Weekly Spending Trend</h4>
        <p className="text-[11px] text-secondary mt-0.5">Average fuel price has stabilized this week.</p>
      </div>

      <div className="h-32 mt-4 relative z-10 w-full select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 9, fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.04)', radius: 8 }} />
            <Bar 
              dataKey="amount" 
              radius={[6, 6, 0, 0]}
              maxBarSize={30}
            >
              {trendData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 5 ? "#2563EB" : "rgba(37, 99, 235, 0.25)"}
                  className="hover:fill-transit-blue transition-colors duration-200 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Decorative gradient background glow */}
      <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-transit-blue/5 rounded-full blur-[80px] pointer-events-none"></div>
    </div>
  );
};

export default FuelExpenseChart;
