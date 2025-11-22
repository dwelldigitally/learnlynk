import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface QuickInsightsChartProps {
  title: string;
  type: 'bar' | 'pie' | 'line';
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
export const QuickInsightsChart: React.FC<QuickInsightsChartProps> = ({
  title,
  type,
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  colors = COLORS
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} />
              <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>;
      case 'pie':
        return <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({
              name,
              percent
            }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey={dataKey}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} />
            </PieChart>
          </ResponsiveContainer>;
      case 'line':
        return <ResponsiveContainer width="100%" height={250}>
            
          </ResponsiveContainer>;
    }
  };
  return <Card>
      
      
    </Card>;
};