-- 00002_tenancy_and_users.sql

CREATE TABLE public.rtos (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    rto_code TEXT NOT NULL UNIQUE,
    address_line_1 TEXT,
    suburb TEXT,
    state TEXT,
    postcode TEXT,
    -- (AVETMISS COMPLIANCE - NAT00010)
    type_identifier TEXT,
    phone_number TEXT,
    facsimile_number TEXT,
    email_address TEXT,
    contact_name TEXT,
    statistical_area_1_id TEXT,
    statistical_area_2_id TEXT
);
COMMENT ON TABLE public.rtos IS 'Stores information about each RTO tenant in the system (NAT00010).';

-- (AVETMISS COMPLIANCE - NAT00020)
CREATE TABLE public.delivery_locations (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    location_id_internal TEXT NOT NULL, -- The RTO's unique identifier for the location
    name TEXT NOT NULL,
    address_line_1 TEXT,
    suburb TEXT,
    state TEXT,
    postcode TEXT,
    UNIQUE(rto_id, location_id_internal)
);
COMMENT ON TABLE public.delivery_locations IS 'Stores RTO delivery location information (NAT00020).';

CREATE TYPE public.user_role AS ENUM ('ADMISSIONS_OFFICER', 'SENIOR_ADMISSIONS_OFFICER', 'COMPLIANCE_MANAGER', 'ACADEMIC_HEAD', 'FINANCE_OFFICER', 'ADMIN');
CREATE TABLE public.profiles ( id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE, role user_role NOT NULL, first_name TEXT, last_name TEXT );
CREATE OR REPLACE FUNCTION public.get_my_rto_id() RETURNS UUID AS $$ DECLARE rto_id UUID; BEGIN SELECT raw_app_meta_data->>'rto_id' INTO rto_id FROM auth.users WHERE id = auth.uid(); RETURN rto_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;