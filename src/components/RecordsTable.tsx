import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TVDERecord } from '@/hooks/useTVDERecords';
import { Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RecordsTableProps {
  records: TVDERecord[];
  onDelete: (id: string) => Promise<void>;
  calculateNetProfit: (uber: number, bolt: number) => number;
  calculateNetPlus2: (netProfit: number, tips: number) => number;
}

export function RecordsTable({ records, onDelete, calculateNetProfit, calculateNetPlus2 }: RecordsTableProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No records yet</h3>
        <p className="text-muted-foreground">Add your first daily record to get started!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="text-right font-semibold">Uber</TableHead>
            <TableHead className="text-right font-semibold">Bolt</TableHead>
            <TableHead className="text-right font-semibold">Tips</TableHead>
            <TableHead className="text-right font-semibold">Prizes</TableHead>
            <TableHead className="text-right font-semibold">Charging</TableHead>
            <TableHead className="text-right font-semibold">Washing</TableHead>
            <TableHead className="text-right font-semibold">Tolls</TableHead>
            <TableHead className="text-right font-semibold">Snacks</TableHead>
            <TableHead className="text-right font-semibold">Other</TableHead>
            <TableHead className="text-right font-semibold">Net Profit</TableHead>
            <TableHead className="text-right font-semibold">Net + 2</TableHead>
            <TableHead className="text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const netProfit = calculateNetProfit(record.uber, record.bolt);
            const netPlus2 = calculateNetPlus2(netProfit, record.tips);
            
            return (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">€{record.uber.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">€{record.bolt.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">€{record.tips.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">€{record.prizes.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-destructive">€{record.charging.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-destructive">€{record.washing.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-destructive">€{record.tolls.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-destructive">€{record.snacks.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-destructive">€{record.other.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-primary/10 text-primary font-mono">
                    €{netProfit.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-success/10 text-success font-mono">
                    €{netPlus2.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this record?')) {
                        onDelete(record.id);
                      }
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}