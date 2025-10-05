-- Migration: Auth-Profile Sync Function
-- Description: Creates a function to create profile records for new users

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function that will handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user(
  user_id UUID,
  rto_id UUID,
  role text,
  first_name text DEFAULT '',
  last_name text DEFAULT ''
)
RETURNS void AS $$
DECLARE
  user_role public.user_role;
BEGIN
  -- Validate rto_id is not null
  IF rto_id IS NULL THEN
    RAISE EXCEPTION 'rto_id is required';
  END IF;

  -- Verify RTO exists
  IF NOT EXISTS (SELECT 1 FROM public.rtos WHERE id = rto_id) THEN
    RAISE EXCEPTION 'Invalid rto_id: RTO with ID % does not exist', rto_id;
  END IF;
  
  -- Cast and validate role
  BEGIN
    user_role := role::public.user_role;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid role. Must be one of: ADMISSIONS_OFFICER, SENIOR_ADMISSIONS_OFFICER, COMPLIANCE_MANAGER, ACADEMIC_HEAD, FINANCE_OFFICER, ADMIN. Got: %', role;
  END;
  
  -- Insert into profiles
  INSERT INTO public.profiles (
    id,
    rto_id,
    role,
    first_name,
    last_name
  ) VALUES (
    user_id,
    rto_id,
    user_role,
    first_name,
    last_name
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log the error details
  RAISE NOTICE 'Error in handle_new_user: %, Detail: %, Hint: %', SQLERRM, SQLSTATE, SQLERRM;
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user IS 'Creates a profile record for a new user. Called after user creation in auth.users.';