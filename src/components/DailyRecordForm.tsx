import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { NewTVDERecord } from '@/hooks/useTVDERecords';
import { Car, Fuel, Droplets, Navigation, Utensils, MoreHorizontal } from 'lucide-react';

interface DailyRecordFormProps {
  onSubmit: (data: NewTVDERecord) => Promise<void>;
  onCancel: () => void;
}

export function DailyRecordForm({ onSubmit, onCancel }: DailyRecordFormProps) {
  const [formData, setFormData] = useState<NewTVDERecord>({
    date: new Date().toISOString().split('T')[0],
    uber: 0,
    bolt: 0,
    tips: 0,
    prizes: 0,
    charging: 0,
    washing: 0,
    tolls: 0,
    snacks: 0,
    other: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (key: keyof NewTVDERecord, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: typeof value === 'string' && key !== 'date' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNetProfit = () => {
    return formData.uber * 0.75 + formData.bolt * 0.80;
  };

  const calculateNetPlus2 = () => {
    const netProfit = calculateNetProfit();
    return netProfit * 0.5 + formData.tips;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
        />
      </div>

      <Separator />

      {/* Earnings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-success flex items-center gap-2">
          <Car className="h-5 w-5" />
          Earnings
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="uber">Uber (€)</Label>
            <Input
              id="uber"
              type="number"
              step="0.01"
              min="0"
              value={formData.uber}
              onChange={(e) => handleInputChange('uber', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bolt">Bolt (€)</Label>
            <Input
              id="bolt"
              type="number"
              step="0.01"
              min="0"
              value={formData.bolt}
              onChange={(e) => handleInputChange('bolt', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tips">Tips (€)</Label>
            <Input
              id="tips"
              type="number"
              step="0.01"
              min="0"
              value={formData.tips}
              onChange={(e) => handleInputChange('tips', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prizes">Prizes (€)</Label>
            <Input
              id="prizes"
              type="number"
              step="0.01"
              min="0"
              value={formData.prizes}
              onChange={(e) => handleInputChange('prizes', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Expenses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Expenses
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="charging" className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              Charging (€)
            </Label>
            <Input
              id="charging"
              type="number"
              step="0.01"
              min="0"
              value={formData.charging}
              onChange={(e) => handleInputChange('charging', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="washing" className="flex items-center gap-1">
              <Droplets className="h-4 w-4" />
              Washing (€)
            </Label>
            <Input
              id="washing"
              type="number"
              step="0.01"
              min="0"
              value={formData.washing}
              onChange={(e) => handleInputChange('washing', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tolls" className="flex items-center gap-1">
              <Navigation className="h-4 w-4" />
              Tolls (€)
            </Label>
            <Input
              id="tolls"
              type="number"
              step="0.01"
              min="0"
              value={formData.tolls}
              onChange={(e) => handleInputChange('tolls', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="snacks" className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              Snacks (€)
            </Label>
            <Input
              id="snacks"
              type="number"
              step="0.01"
              min="0"
              value={formData.snacks}
              onChange={(e) => handleInputChange('snacks', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="other" className="flex items-center gap-1">
              <MoreHorizontal className="h-4 w-4" />
              Other (€)
            </Label>
            <Input
              id="other"
              type="number"
              step="0.01"
              min="0"
              value={formData.other}
              onChange={(e) => handleInputChange('other', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Calculated Values */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Net Profit (after platform fees):</span>
          <span className="font-bold text-primary">€{calculateNetProfit().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Net + 2 (Net × 0.5 + Tips):</span>
          <span className="font-bold text-success">€{calculateNetPlus2().toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          {isSubmitting ? "Adding..." : "Add Record"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}