-- CRITICAL SECURITY FIX: Remove public access to marketplace credentials
-- The 'Allow all operations on marketplace_credentials' policy with 'true' expression
-- allows anyone to access sensitive API keys and affiliate credentials

-- Drop ALL existing policies on marketplace_credentials to start clean
DROP POLICY IF EXISTS "Allow all operations on marketplace_credentials" ON public.marketplace_credentials;
DROP POLICY IF EXISTS "Only admins can manage credentials" ON public.marketplace_credentials;

-- Create a single, secure admin-only policy
CREATE POLICY "Only admins can manage credentials" 
ON public.marketplace_credentials 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);