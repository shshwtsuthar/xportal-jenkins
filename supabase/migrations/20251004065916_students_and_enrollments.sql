-- 00005_students_and_enrollments.sql

CREATE TABLE public.students ( id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), student_id_display TEXT NOT NULL UNIQUE, rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE, application_id UUID UNIQUE REFERENCES public.applications(id), created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, date_of_birth DATE NOT NULL );
COMMENT ON TABLE public.students IS 'The permanent record of an enrolled student. Personal data is copied from the source application upon approval to create an immutable enrollment record.';

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    qualification_id UUID NOT NULL REFERENCES public.qualifications(id) ON DELETE CASCADE,
    rto_id UUID NOT NULL REFERENCES public.rtos(id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'ACTIVE',
    commencement_date DATE NOT NULL,
    expected_completion_date DATE,
    -- (AVETMISS COMPLIANCE - NAT00120)
    funding_source_code TEXT,
    funding_source_state_id TEXT,
    commencing_program_identifier TEXT,
    vet_in_schools_flag TEXT,
    -- (AVETMISS COMPLIANCE - NAT00130)
    date_completed DATE,
    certificate_issued_flag TEXT,
    parchment_number TEXT,
    parchment_issue_date DATE
);
COMMENT ON TABLE public.enrollments IS 'Links a student to a qualification, tracking activity (NAT00120) and completion (NAT00130).';

CREATE TRIGGER audit_student_changes AFTER INSERT OR UPDATE OR DELETE ON public.students FOR EACH ROW EXECUTE FUNCTION public.record_change();
CREATE TRIGGER audit_enrollment_changes AFTER INSERT OR UPDATE OR DELETE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.record_change();