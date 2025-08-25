import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AttributionData {
  name: string;
  impact: number;
  color: string;
}

interface AttributionWaterfallProps {
  data: AttributionData[];
}

export function AttributionWaterfall({ data }: AttributionWaterfallProps) {
  // Create waterfall data with cumulative values
  let cumulative = 0;
  const waterfallData = data.map((item, index) => {
    const startValue = cumulative;
    cumulative += item.impact;
    return {
      name: item.name,
      value: item.impact,
      cumulative,
      startValue,
      color: item.color,
      isFirst: index === 0,
      isLast: index === data.length - 1
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-muted-foreground">
            Impact: {data.value}% improvement
          </p>
          <p className="text-sm text-muted-foreground">
            Cumulative: {data.cumulative}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={waterfallData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {waterfallData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}