import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TVDERecord } from '@/hooks/useTVDERecords';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface StatsCardsProps {
  records: TVDERecord[];
}

export function StatsCards({ records }: StatsCardsProps) {
  // Calculate current month stats
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthRecords = records.filter(record => 
    record.date.startsWith(currentMonth)
  );

  // Calculate previous month stats for comparison
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const prevMonthStr = previousMonth.toISOString().slice(0, 7);
  const previousMonthRecords = records.filter(record => 
    record.date.startsWith(prevMonthStr)
  );

  const calculateTotals = (recordSet: TVDERecord[]) => {
    return recordSet.reduce((acc, record) => {
      acc.earnings += record.uber + record.bolt + record.tips + record.prizes;
      acc.expenses += record.charging + record.washing + record.tolls + record.snacks + record.other;
      acc.netProfit += record.uber * 0.75 + record.bolt * 0.80;
      return acc;
    }, { earnings: 0, expenses: 0, netProfit: 0 });
  };

  const currentStats = calculateTotals(currentMonthRecords);
  const previousStats = calculateTotals(previousMonthRecords);

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const earningsChange = getPercentageChange(currentStats.earnings, previousStats.earnings);
  const netProfitChange = getPercentageChange(currentStats.netProfit, previousStats.netProfit);

  const stats = [
    {
      title: "Monthly Earnings",
      value: `€${currentStats.earnings.toFixed(2)}`,
      change: earningsChange,
      icon: DollarSign,
      description: "Total earnings this month",
    },
    {
      title: "Monthly Net Profit",
      value: `€${currentStats.netProfit.toFixed(2)}`,
      change: netProfitChange,
      icon: TrendingUp,
      description: "After platform fees",
    },
    {
      title: "Monthly Expenses",
      value: `€${currentStats.expenses.toFixed(2)}`,
      change: getPercentageChange(currentStats.expenses, previousStats.expenses),
      icon: TrendingDown,
      description: "Total expenses this month",
    },
    {
      title: "Active Days",
      value: currentMonthRecords.length.toString(),
      change: getPercentageChange(currentMonthRecords.length, previousMonthRecords.length),
      icon: Calendar,
      description: "Days worked this month",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        
        return (
          <Card key={index} className="bg-gradient-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={`flex items-center ${
                  isPositive ? 'text-success' : 'text-destructive'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
                <span>vs last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}