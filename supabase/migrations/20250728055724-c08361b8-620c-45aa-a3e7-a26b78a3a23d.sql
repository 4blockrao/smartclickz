-- Create campaign_tasks table to track individual task assignments
CREATE TABLE IF NOT EXISTS public.campaign_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'submitted', 'approved', 'rejected')),
  assigned_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  reward_amount NUMERIC NOT NULL,
  proof_url TEXT,
  proof_description TEXT,
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for campaign_tasks
CREATE POLICY "Users can view available tasks" ON public.campaign_tasks
  FOR SELECT USING (status = 'available' OR user_id = auth.uid());

CREATE POLICY "Users can update their assigned tasks" ON public.campaign_tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert tasks" ON public.campaign_tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all tasks" ON public.campaign_tasks
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to generate tasks when campaign is activated
CREATE OR REPLACE FUNCTION generate_campaign_tasks(campaign_id_param UUID)
RETURNS void AS $$
DECLARE
    campaign_record campaigns%ROWTYPE;
    i INTEGER;
BEGIN
    -- Get campaign details
    SELECT * INTO campaign_record FROM campaigns WHERE id = campaign_id_param;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Campaign not found';
    END IF;
    
    -- Generate individual tasks
    FOR i IN 1..campaign_record.max_tasks LOOP
        INSERT INTO campaign_tasks (
            campaign_id,
            reward_amount,
            status
        ) VALUES (
            campaign_id_param,
            campaign_record.reward_per_task,
            'available'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update campaign statistics
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.status = 'approved' AND OLD.status = 'submitted' THEN
        -- Update campaign completion stats
        UPDATE campaigns SET 
            completed_tasks = completed_tasks + 1,
            spent_budget = spent_budget + NEW.reward_amount,
            updated_at = now()
        WHERE id = NEW.campaign_id;
        
        -- Update client spending
        UPDATE clients SET
            total_spent = total_spent + NEW.reward_amount,
            wallet_balance = wallet_balance - NEW.reward_amount,
            updated_at = now()
        WHERE id = (SELECT client_id FROM campaigns WHERE id = NEW.campaign_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign stats
CREATE TRIGGER update_campaign_stats_trigger
    AFTER UPDATE ON campaign_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_stats();