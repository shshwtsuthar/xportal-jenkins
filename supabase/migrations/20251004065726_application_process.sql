-- 00004_application_process.sql

CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    status application_status NOT NULL DEFAULT 'DRAFT',
    assigned_to UUID REFERENCES public.profiles(id),
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    address_line_1 TEXT,
    suburb TEXT,
    state TEXT,
    postcode TEXT,
    country_of_birth_id TEXT,
    phone_number TEXT,
    email TEXT,
    is_international BOOLEAN DEFAULT FALSE,
    citizenship_status_code TEXT,
    passport_number TEXT,
    visa_type TEXT,
    usi TEXT,
    language_code TEXT,
    english_proficiency_code TEXT,
    qualification_id UUID REFERENCES public.qualifications(id),
    proposed_commencement_date DATE,
    -- (AVETMISS COMPLIANCE - NAT00080)
    gender TEXT,
    highest_school_level_id TEXT,
    indigenous_status_id TEXT,
    labour_force_status_id TEXT,
    at_school_flag TEXT
    -- The incorrect boolean flags 'disability_flag' and 'prior_education_flag' have been REMOVED.
);
COMMENT ON TABLE public.applications IS 'Stores all pre-enrollment data for a potential student (NAT00080, NAT00085).';

-- (AVETMISS COMPLIANCE - NAT00090)
CREATE TABLE public.application_disabilities (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    disability_type_id TEXT NOT NULL
);
COMMENT ON TABLE public.application_disabilities IS 'Stores client disability types, one record per type (NAT00090).';

-- (AVETMISS COMPLIANCE - NAT00100)
CREATE TABLE public.application_prior_education (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    prior_achievement_id TEXT NOT NULL
);
COMMENT ON TABLE public.application_prior_education IS 'Stores client prior education achievements, one record per qualification (NAT00100).';

CREATE TRIGGER on_app_update_set_timestamp BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER audit_application_changes AFTER INSERT OR UPDATE OR DELETE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.record_change();
-- (AVETMISS COMPLIANCE) Add audit triggers for new tables
CREATE TRIGGER audit_disability_changes AFTER INSERT OR UPDATE OR DELETE ON public.application_disabilities FOR EACH ROW EXECUTE FUNCTION public.record_change();
CREATE TRIGGER audit_prior_ed_changes AFTER INSERT OR UPDATE OR DELETE ON public.application_prior_education FOR EACH ROW EXECUTE FUNCTION public.record_change();