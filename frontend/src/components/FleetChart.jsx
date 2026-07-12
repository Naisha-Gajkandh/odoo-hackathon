import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FleetChart = ({ data }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-border soft-shadow flex flex-col gap-6 select-none w-full animate-fade-in">
      <div className="flex flex-col gap-1">
        <h3 className="font-headline-md text-headline-md text-primary font-black">Fleet Availability & Allocation</h3>
        <p className="text-xs text-secondary font-bold">Active vs Idle count across the fleet over the past weeks</p>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
              domain={[0, 160]}
            />
            <Tooltip
              contentStyle={{ border: '1px solid #E5E7EB', borderRadius: '12px', fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 'bold' }}
              itemStyle={{ fontWeight: 'bold', fontFamily: 'Manrope, sans-serif' }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontFamily: 'Manrope, sans-serif', fontWeight: 'bold' }}
            />
            <Bar 
              name="Active Vehicles" 
              dataKey="active" 
              stackId="a" 
              fill="#2563EB" 
              radius={[0, 0, 4, 4]} 
            />
            <Bar 
              name="Idle/In-Shop" 
              dataKey="idle" 
              stackId="a" 
              fill="#E5E7EB" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FleetChart;
