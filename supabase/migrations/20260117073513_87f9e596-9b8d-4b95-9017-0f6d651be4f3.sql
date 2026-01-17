-- Add DELETE policy to allow users to delete their own profile
-- This enables GDPR compliance (right to erasure) and user data control
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);