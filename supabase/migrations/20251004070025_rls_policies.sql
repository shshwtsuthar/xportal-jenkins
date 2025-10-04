-- 00008_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE public.rtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units_of_competency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plan_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- (AVETMISS COMPLIANCE) Enable RLS on new tables
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_disabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_prior_education ENABLE ROW LEVEL SECURITY;

-- Create Policies with unique names
CREATE POLICY "rls_rtos_select" ON public.rtos FOR SELECT USING (id = public.get_my_rto_id());
CREATE POLICY "rls_profiles_all" ON public.profiles FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_units_all" ON public.units_of_competency FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_qualifications_all" ON public.qualifications FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_qualification_units_all" ON public.qualification_units FOR ALL USING ((SELECT rto_id FROM public.qualifications WHERE id = qualification_id) = public.get_my_rto_id());
CREATE POLICY "rls_applications_all" ON public.applications FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_students_all" ON public.students FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_enrollments_all" ON public.enrollments FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_terms_all" ON public.terms FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_unit_offerings_all" ON public.unit_offerings FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_enrollment_units_all" ON public.enrollment_units FOR ALL USING ((SELECT rto_id FROM public.enrollments WHERE id = enrollment_id) = public.get_my_rto_id());
CREATE POLICY "rls_payment_plan_templates_all" ON public.payment_plan_templates FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_invoices_all" ON public.invoices FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_payments_all" ON public.payments FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_events_all" ON public.events FOR ALL USING (rto_id = public.get_my_rto_id());
-- (AVETMISS COMPLIANCE) Add policies for new tables
CREATE POLICY "rls_delivery_locations_all" ON public.delivery_locations FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_application_disabilities_all" ON public.application_disabilities FOR ALL USING (rto_id = public.get_my_rto_id());
CREATE POLICY "rls_application_prior_education_all" ON public.application_prior_education FOR ALL USING (rto_id = public.get_my_rto_id());