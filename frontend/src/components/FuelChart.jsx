import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FuelChart = ({ data }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-border soft-shadow flex flex-col gap-6 select-none w-full animate-fade-in">
      <div className="flex flex-col gap-1">
        <h3 className="font-headline-md text-headline-md text-primary font-black">Fuel Consumption Trend</h3>
        <p className="text-xs text-secondary font-bold">Average liters per 100 kilometers (L/100km) by fleet type</p>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold', fontFamily: 'Manrope, sans-serif' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 'bold', fontFamily: 'Manrope, sans-serif' }}
              domain={[0, 30]}
              tickFormatter={(v) => `${v} L`}
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
            <Area 
              type="monotone" 
              name="Class 8 Truck" 
              dataKey="Class8" 
              stroke="#2563EB" 
              strokeWidth={3} 
              fillOpacity={0.05} 
              fill="#2563EB" 
            />
            <Area 
              type="monotone" 
              name="Delivery Van" 
              dataKey="Van" 
              stroke="#F97316" 
              strokeWidth={3} 
              fillOpacity={0.05} 
              fill="#F97316" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuelChart;
