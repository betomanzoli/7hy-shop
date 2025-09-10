-- CRITICAL SECURITY FIX: Remove public access to marketplace credentials
-- The 'Allow all operations on marketplace_credentials' policy with 'true' expression
-- allows anyone to access sensitive API keys and affiliate credentials

-- Drop the dangerous public access policy
DROP POLICY IF EXISTS "Allow all operations on marketplace_credentials" ON public.marketplace_credentials;

-- Ensure only the admin-only policy remains active
-- Verify the admin policy exists and works correctly
CREATE POLICY IF NOT EXISTS "Only admins can manage credentials" 
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

-- Add additional security: prevent any unauthenticated access
CREATE POLICY IF NOT EXISTS "Deny anonymous access to credentials"
ON public.marketplace_credentials
FOR ALL
TO anon
USING (false);

-- Ensure authenticated non-admins cannot access credentials
CREATE POLICY IF NOT EXISTS "Authenticated non-admins cannot access credentials"
ON public.marketplace_credentials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);