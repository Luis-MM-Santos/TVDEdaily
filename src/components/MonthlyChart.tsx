import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TVDERecord } from '@/hooks/useTVDERecords';
import { format, parseISO } from 'date-fns';

interface MonthlyChartProps {
  records: TVDERecord[];
}

export function MonthlyChart({ records }: MonthlyChartProps) {
  const monthlyData = useMemo(() => {
    const monthlyStats: Record<string, {
      month: string;
      earnings: number;
      expenses: number;
      netProfit: number;
      days: number;
    }> = {};

    records.forEach((record) => {
      const date = parseISO(record.date);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM yyyy');

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthLabel,
          earnings: 0,
          expenses: 0,
          netProfit: 0,
          days: 0,
        };
      }

      const earnings = record.uber + record.bolt + record.tips + record.prizes;
      const expenses = record.charging + record.washing + record.tolls + record.snacks + record.other;
      const netProfit = record.uber * 0.75 + record.bolt * 0.80;

      monthlyStats[monthKey].earnings += earnings;
      monthlyStats[monthKey].expenses += expenses;
      monthlyStats[monthKey].netProfit += netProfit;
      monthlyStats[monthKey].days += 1;
    });

    return Object.values(monthlyStats).sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  if (monthlyData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Earnings vs Expenses Chart */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Monthly Earnings vs Expenses</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number, name: string) => [
                `€${value.toFixed(2)}`,
                name === 'earnings' ? 'Earnings' : name === 'expenses' ? 'Expenses' : 'Net Profit'
              ]}
            />
            <Bar 
              dataKey="earnings" 
              fill="hsl(var(--success))" 
              name="earnings"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="expenses" 
              fill="hsl(var(--destructive))" 
              name="expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Net Profit Trend */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Net Profit Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => [`€${value.toFixed(2)}`, 'Net Profit']}
            />
            <Line 
              type="monotone" 
              dataKey="netProfit" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {monthlyData.map((month, index) => (
          <div key={month.month} className="bg-muted/50 p-4 rounded-lg">
            <h5 className="font-semibold text-sm text-muted-foreground mb-2">{month.month}</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Days:</span>
                <span className="font-mono font-semibold">{month.days}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg/Day:</span>
                <span className="font-mono font-semibold text-primary">
                  €{(month.netProfit / month.days).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-mono font-semibold text-success">
                  €{month.netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}