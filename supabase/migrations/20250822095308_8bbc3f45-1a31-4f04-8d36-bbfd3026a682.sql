-- Create TVDE records table with proper structure and RLS
CREATE TABLE public.tvde_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  uber DECIMAL(10,2) DEFAULT 0,
  bolt DECIMAL(10,2) DEFAULT 0,
  tips DECIMAL(10,2) DEFAULT 0,
  prizes DECIMAL(10,2) DEFAULT 0,
  charging DECIMAL(10,2) DEFAULT 0,
  washing DECIMAL(10,2) DEFAULT 0,
  tolls DECIMAL(10,2) DEFAULT 0,
  snacks DECIMAL(10,2) DEFAULT 0,
  other DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.tvde_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own records" 
ON public.tvde_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own records" 
ON public.tvde_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" 
ON public.tvde_records 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" 
ON public.tvde_records 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tvde_records_updated_at
  BEFORE UPDATE ON public.tvde_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_tvde_records_user_date ON public.tvde_records(user_id, date DESC);