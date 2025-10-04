-- 00006_timetabling.sql

CREATE TABLE public.terms ( id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE, name TEXT NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL );
CREATE TABLE public.unit_offerings ( id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE, unit_id UUID NOT NULL REFERENCES public.units_of_competency(id) ON DELETE CASCADE, rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE, start_date DATE NOT NULL, end_date DATE NOT NULL, median_date DATE NOT NULL );

CREATE TABLE public.enrollment_units (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    unit_offering_id UUID NOT NULL REFERENCES public.unit_offerings(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    is_catch_up BOOLEAN DEFAULT FALSE,
    -- (AVETMISS COMPLIANCE - NAT00120)
    delivery_location_id UUID REFERENCES public.delivery_locations(id),
    outcome_code TEXT,
    delivery_mode_id TEXT,
    scheduled_hours INT,
    associated_course_id TEXT,
    full_time_identifier TEXT,
    specific_funding_id TEXT,
    school_level_id TEXT,
    school_type_id TEXT,
    vet_flag TEXT,
    predominant_delivery_mode TEXT,
    apprentice_identifier TEXT
);
COMMENT ON TABLE public.enrollment_units IS 'Connects a student enrollment to a specific unit offering, tracking granular AVETMISS training activity (NAT00120).';