-- 00003_academic_framework.sql

CREATE TABLE public.units_of_competency (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    nominal_hours INT,
    -- (AVETMISS COMPLIANCE - NAT00060)
    field_of_education_id TEXT,
    vet_flag TEXT,
    UNIQUE(rto_id, code)
);
COMMENT ON TABLE public.units_of_competency IS 'The smallest academic building blocks (AVETMISS Subjects - NAT00060).';

CREATE TABLE public.qualifications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    -- (AVETMISS COMPLIANCE - NAT00030)
    level_of_education_id TEXT,
    field_of_education_id TEXT,
    anzsco_id TEXT,
    anzsic_id TEXT,
    recognition_id TEXT,
    vet_flag TEXT,
    nominal_hours INT,
    UNIQUE(rto_id, code)
);
COMMENT ON TABLE public.qualifications IS 'The courses or programs offered by the RTO (AVETMISS Programs - NAT00030).';

CREATE TABLE public.qualification_units ( id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), qualification_id UUID NOT NULL REFERENCES public.qualifications(id) ON DELETE CASCADE, unit_id UUID NOT NULL REFERENCES public.units_of_competency(id) ON DELETE CASCADE, is_core BOOLEAN DEFAULT TRUE, prerequisite_unit_id UUID REFERENCES public.units_of_competency(id), sequence_order INT, UNIQUE(qualification_id, unit_id) );