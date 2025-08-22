import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface TVDERecord {
  id: string;
  date: string;
  uber: number;
  bolt: number;
  tips: number;
  prizes: number;
  charging: number;
  washing: number;
  tolls: number;
  snacks: number;
  other: number;
  created_at: string;
}

export interface NewTVDERecord {
  date: string;
  uber: number;
  bolt: number;
  tips: number;
  prizes: number;
  charging: number;
  washing: number;
  tolls: number;
  snacks: number;
  other: number;
}

export function useTVDERecords() {
  const [records, setRecords] = useState<TVDERecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tvde_records')
        .select('id, date, uber, bolt, tips, prizes, charging, washing, tolls, snacks, other, created_at')
        .order('date', { ascending: false });

      if (error) {
        toast({
          title: "Error loading records",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setRecords(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (record: NewTVDERecord) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tvde_records')
        .insert({
          user_id: user.id,
          ...record,
        });

      if (error) {
        toast({
          title: "Error adding record",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Record added successfully",
      });

      fetchRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add record",
        variant: "destructive",
      });
    }
  };

  const deleteRecord = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tvde_records')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting record",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Record deleted successfully",
      });

      fetchRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  return {
    records,
    loading,
    fetchRecords,
    addRecord,
    deleteRecord,
  };
}