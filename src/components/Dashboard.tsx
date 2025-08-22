import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTVDERecords } from '@/hooks/useTVDERecords';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DailyRecordForm } from '@/components/DailyRecordForm';
import { RecordsTable } from '@/components/RecordsTable';
import { StatsCards } from '@/components/StatsCards';
import { MonthlyChart } from '@/components/MonthlyChart';
import { Car, LogOut, Plus, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { records, loading, addRecord, deleteRecord } = useTVDERecords();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateNetProfit = (uber: number, bolt: number) => {
    return uber * 0.75 + bolt * 0.80;
  };

  const calculateNetPlus2 = (netProfit: number, tips: number) => {
    return netProfit * 0.5 + tips;
  };

  // Calculate totals
  const totalEarnings = records.reduce((sum, record) => sum + record.uber + record.bolt + record.tips + record.prizes, 0);
  const totalExpenses = records.reduce((sum, record) => sum + record.charging + record.washing + record.tolls + record.snacks + record.other, 0);
  const totalNetProfit = records.reduce((sum, record) => sum + calculateNetProfit(record.uber, record.bolt), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">TVDE Manager</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10">
                <TrendingUp className="h-4 w-4 mr-1" />
                {records.length} Records
              </Badge>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Record
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Add Record Form */}
        {showAddForm && (
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Add Daily Record</CardTitle>
              <CardDescription>
                Enter your earnings and expenses for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyRecordForm 
                onSubmit={async (data) => {
                  await addRecord(data);
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-success border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-success-foreground/80">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-foreground">
                €{totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-success-foreground/70 mt-1">
                Uber + Bolt + Tips + Prizes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-foreground">
                €{totalNetProfit.toFixed(2)}
              </div>
              <p className="text-xs text-primary-foreground/70 mt-1">
                After platform fees
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                €{totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Charging + Maintenance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Chart */}
        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Your earnings and profit trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyChart records={records} />
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle>Daily Records</CardTitle>
            <CardDescription>
              View and manage your daily earnings and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading records...</div>
            ) : (
              <RecordsTable 
                records={records} 
                onDelete={deleteRecord}
                calculateNetProfit={calculateNetProfit}
                calculateNetPlus2={calculateNetPlus2}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}