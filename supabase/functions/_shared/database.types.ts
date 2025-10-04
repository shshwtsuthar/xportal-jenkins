export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      application_disabilities: {
        Row: {
          application_id: string;
          disability_type_id: string;
          id: string;
          rto_id: string;
        };
        Insert: {
          application_id: string;
          disability_type_id: string;
          id?: string;
          rto_id: string;
        };
        Update: {
          application_id?: string;
          disability_type_id?: string;
          id?: string;
          rto_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'application_disabilities_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_disabilities_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      application_prior_education: {
        Row: {
          application_id: string;
          id: string;
          prior_achievement_id: string;
          rto_id: string;
        };
        Insert: {
          application_id: string;
          id?: string;
          prior_achievement_id: string;
          rto_id: string;
        };
        Update: {
          application_id?: string;
          id?: string;
          prior_achievement_id?: string;
          rto_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'application_prior_education_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_prior_education_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      applications: {
        Row: {
          address_line_1: string | null;
          assigned_to: string | null;
          at_school_flag: string | null;
          citizenship_status_code: string | null;
          country_of_birth_id: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          english_proficiency_code: string | null;
          first_name: string | null;
          gender: string | null;
          highest_school_level_id: string | null;
          id: string;
          indigenous_status_id: string | null;
          is_international: boolean | null;
          labour_force_status_id: string | null;
          language_code: string | null;
          last_name: string | null;
          passport_number: string | null;
          phone_number: string | null;
          postcode: string | null;
          proposed_commencement_date: string | null;
          qualification_id: string | null;
          rto_id: string;
          state: string | null;
          status: Database['public']['Enums']['application_status'];
          suburb: string | null;
          updated_at: string | null;
          usi: string | null;
          visa_type: string | null;
        };
        Insert: {
          address_line_1?: string | null;
          assigned_to?: string | null;
          at_school_flag?: string | null;
          citizenship_status_code?: string | null;
          country_of_birth_id?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          english_proficiency_code?: string | null;
          first_name?: string | null;
          gender?: string | null;
          highest_school_level_id?: string | null;
          id?: string;
          indigenous_status_id?: string | null;
          is_international?: boolean | null;
          labour_force_status_id?: string | null;
          language_code?: string | null;
          last_name?: string | null;
          passport_number?: string | null;
          phone_number?: string | null;
          postcode?: string | null;
          proposed_commencement_date?: string | null;
          qualification_id?: string | null;
          rto_id: string;
          state?: string | null;
          status?: Database['public']['Enums']['application_status'];
          suburb?: string | null;
          updated_at?: string | null;
          usi?: string | null;
          visa_type?: string | null;
        };
        Update: {
          address_line_1?: string | null;
          assigned_to?: string | null;
          at_school_flag?: string | null;
          citizenship_status_code?: string | null;
          country_of_birth_id?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          english_proficiency_code?: string | null;
          first_name?: string | null;
          gender?: string | null;
          highest_school_level_id?: string | null;
          id?: string;
          indigenous_status_id?: string | null;
          is_international?: boolean | null;
          labour_force_status_id?: string | null;
          language_code?: string | null;
          last_name?: string | null;
          passport_number?: string | null;
          phone_number?: string | null;
          postcode?: string | null;
          proposed_commencement_date?: string | null;
          qualification_id?: string | null;
          rto_id?: string;
          state?: string | null;
          status?: Database['public']['Enums']['application_status'];
          suburb?: string | null;
          updated_at?: string | null;
          usi?: string | null;
          visa_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_assigned_to_fkey';
            columns: ['assigned_to'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_qualification_id_fkey';
            columns: ['qualification_id'];
            isOneToOne: false;
            referencedRelation: 'qualifications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      delivery_locations: {
        Row: {
          address_line_1: string | null;
          id: string;
          location_id_internal: string;
          name: string;
          postcode: string | null;
          rto_id: string;
          state: string | null;
          suburb: string | null;
        };
        Insert: {
          address_line_1?: string | null;
          id?: string;
          location_id_internal: string;
          name: string;
          postcode?: string | null;
          rto_id: string;
          state?: string | null;
          suburb?: string | null;
        };
        Update: {
          address_line_1?: string | null;
          id?: string;
          location_id_internal?: string;
          name?: string;
          postcode?: string | null;
          rto_id?: string;
          state?: string | null;
          suburb?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'delivery_locations_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      enrollment_units: {
        Row: {
          apprentice_identifier: string | null;
          associated_course_id: string | null;
          delivery_location_id: string | null;
          delivery_mode_id: string | null;
          end_date: string | null;
          enrollment_id: string;
          full_time_identifier: string | null;
          id: string;
          is_catch_up: boolean | null;
          outcome_code: string | null;
          predominant_delivery_mode: string | null;
          scheduled_hours: number | null;
          school_level_id: string | null;
          school_type_id: string | null;
          specific_funding_id: string | null;
          start_date: string | null;
          unit_offering_id: string;
          vet_flag: string | null;
        };
        Insert: {
          apprentice_identifier?: string | null;
          associated_course_id?: string | null;
          delivery_location_id?: string | null;
          delivery_mode_id?: string | null;
          end_date?: string | null;
          enrollment_id: string;
          full_time_identifier?: string | null;
          id?: string;
          is_catch_up?: boolean | null;
          outcome_code?: string | null;
          predominant_delivery_mode?: string | null;
          scheduled_hours?: number | null;
          school_level_id?: string | null;
          school_type_id?: string | null;
          specific_funding_id?: string | null;
          start_date?: string | null;
          unit_offering_id: string;
          vet_flag?: string | null;
        };
        Update: {
          apprentice_identifier?: string | null;
          associated_course_id?: string | null;
          delivery_location_id?: string | null;
          delivery_mode_id?: string | null;
          end_date?: string | null;
          enrollment_id?: string;
          full_time_identifier?: string | null;
          id?: string;
          is_catch_up?: boolean | null;
          outcome_code?: string | null;
          predominant_delivery_mode?: string | null;
          scheduled_hours?: number | null;
          school_level_id?: string | null;
          school_type_id?: string | null;
          specific_funding_id?: string | null;
          start_date?: string | null;
          unit_offering_id?: string;
          vet_flag?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollment_units_delivery_location_id_fkey';
            columns: ['delivery_location_id'];
            isOneToOne: false;
            referencedRelation: 'delivery_locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollment_units_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollment_units_unit_offering_id_fkey';
            columns: ['unit_offering_id'];
            isOneToOne: false;
            referencedRelation: 'unit_offerings';
            referencedColumns: ['id'];
          },
        ];
      };
      enrollments: {
        Row: {
          certificate_issued_flag: string | null;
          commencement_date: string;
          commencing_program_identifier: string | null;
          date_completed: string | null;
          expected_completion_date: string | null;
          funding_source_code: string | null;
          funding_source_state_id: string | null;
          id: string;
          parchment_issue_date: string | null;
          parchment_number: string | null;
          qualification_id: string;
          rto_id: string;
          status: Database['public']['Enums']['enrollment_status'];
          student_id: string;
          vet_in_schools_flag: string | null;
        };
        Insert: {
          certificate_issued_flag?: string | null;
          commencement_date: string;
          commencing_program_identifier?: string | null;
          date_completed?: string | null;
          expected_completion_date?: string | null;
          funding_source_code?: string | null;
          funding_source_state_id?: string | null;
          id?: string;
          parchment_issue_date?: string | null;
          parchment_number?: string | null;
          qualification_id: string;
          rto_id: string;
          status?: Database['public']['Enums']['enrollment_status'];
          student_id: string;
          vet_in_schools_flag?: string | null;
        };
        Update: {
          certificate_issued_flag?: string | null;
          commencement_date?: string;
          commencing_program_identifier?: string | null;
          date_completed?: string | null;
          expected_completion_date?: string | null;
          funding_source_code?: string | null;
          funding_source_state_id?: string | null;
          id?: string;
          parchment_issue_date?: string | null;
          parchment_number?: string | null;
          qualification_id?: string;
          rto_id?: string;
          status?: Database['public']['Enums']['enrollment_status'];
          student_id?: string;
          vet_in_schools_flag?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_qualification_id_fkey';
            columns: ['qualification_id'];
            isOneToOne: false;
            referencedRelation: 'qualifications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          entity_id: string;
          entity_type: string;
          event_type: string;
          field_name: string | null;
          id: string;
          new_value: Json | null;
          old_value: Json | null;
          rto_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          entity_id: string;
          entity_type: string;
          event_type: string;
          field_name?: string | null;
          id?: string;
          new_value?: Json | null;
          old_value?: Json | null;
          rto_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          entity_id?: string;
          entity_type?: string;
          event_type?: string;
          field_name?: string | null;
          id?: string;
          new_value?: Json | null;
          old_value?: Json | null;
          rto_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          amount_due_cents: number;
          amount_paid_cents: number | null;
          due_date: string;
          enrollment_id: string;
          id: string;
          invoice_number: string;
          issue_date: string;
          rto_id: string;
          status: Database['public']['Enums']['invoice_status'];
        };
        Insert: {
          amount_due_cents: number;
          amount_paid_cents?: number | null;
          due_date: string;
          enrollment_id: string;
          id?: string;
          invoice_number: string;
          issue_date: string;
          rto_id: string;
          status?: Database['public']['Enums']['invoice_status'];
        };
        Update: {
          amount_due_cents?: number;
          amount_paid_cents?: number | null;
          due_date?: string;
          enrollment_id?: string;
          id?: string;
          invoice_number?: string;
          issue_date?: string;
          rto_id?: string;
          status?: Database['public']['Enums']['invoice_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_enrollment_id_fkey';
            columns: ['enrollment_id'];
            isOneToOne: false;
            referencedRelation: 'enrollments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_plan_template_installments: {
        Row: {
          amount_cents: number;
          due_date_rule_days: number;
          id: string;
          name: string;
          template_id: string;
        };
        Insert: {
          amount_cents: number;
          due_date_rule_days: number;
          id?: string;
          name: string;
          template_id: string;
        };
        Update: {
          amount_cents?: number;
          due_date_rule_days?: number;
          id?: string;
          name?: string;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_plan_template_installments_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'payment_plan_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_plan_templates: {
        Row: {
          id: string;
          is_default: boolean | null;
          name: string;
          qualification_id: string;
          rto_id: string;
        };
        Insert: {
          id?: string;
          is_default?: boolean | null;
          name: string;
          qualification_id: string;
          rto_id: string;
        };
        Update: {
          id?: string;
          is_default?: boolean | null;
          name?: string;
          qualification_id?: string;
          rto_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_plan_templates_qualification_id_fkey';
            columns: ['qualification_id'];
            isOneToOne: false;
            referencedRelation: 'qualifications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_plan_templates_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount_cents: number;
          id: string;
          invoice_id: string;
          payment_date: string;
          reconciliation_notes: string | null;
          rto_id: string;
        };
        Insert: {
          amount_cents: number;
          id?: string;
          invoice_id: string;
          payment_date: string;
          reconciliation_notes?: string | null;
          rto_id: string;
        };
        Update: {
          amount_cents?: number;
          id?: string;
          invoice_id?: string;
          payment_date?: string;
          reconciliation_notes?: string | null;
          rto_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          last_name: string | null;
          role: Database['public']['Enums']['user_role'];
          rto_id: string;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          role: Database['public']['Enums']['user_role'];
          rto_id: string;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          role?: Database['public']['Enums']['user_role'];
          rto_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      qualification_units: {
        Row: {
          id: string;
          is_core: boolean | null;
          prerequisite_unit_id: string | null;
          qualification_id: string;
          sequence_order: number | null;
          unit_id: string;
        };
        Insert: {
          id?: string;
          is_core?: boolean | null;
          prerequisite_unit_id?: string | null;
          qualification_id: string;
          sequence_order?: number | null;
          unit_id: string;
        };
        Update: {
          id?: string;
          is_core?: boolean | null;
          prerequisite_unit_id?: string | null;
          qualification_id?: string;
          sequence_order?: number | null;
          unit_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'qualification_units_prerequisite_unit_id_fkey';
            columns: ['prerequisite_unit_id'];
            isOneToOne: false;
            referencedRelation: 'units_of_competency';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'qualification_units_qualification_id_fkey';
            columns: ['qualification_id'];
            isOneToOne: false;
            referencedRelation: 'qualifications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'qualification_units_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'units_of_competency';
            referencedColumns: ['id'];
          },
        ];
      };
      qualifications: {
        Row: {
          anzsco_id: string | null;
          anzsic_id: string | null;
          code: string;
          created_at: string;
          field_of_education_id: string | null;
          id: string;
          level_of_education_id: string | null;
          name: string;
          nominal_hours: number | null;
          recognition_id: string | null;
          rto_id: string;
          vet_flag: string | null;
        };
        Insert: {
          anzsco_id?: string | null;
          anzsic_id?: string | null;
          code: string;
          created_at?: string;
          field_of_education_id?: string | null;
          id?: string;
          level_of_education_id?: string | null;
          name: string;
          nominal_hours?: number | null;
          recognition_id?: string | null;
          rto_id: string;
          vet_flag?: string | null;
        };
        Update: {
          anzsco_id?: string | null;
          anzsic_id?: string | null;
          code?: string;
          created_at?: string;
          field_of_education_id?: string | null;
          id?: string;
          level_of_education_id?: string | null;
          name?: string;
          nominal_hours?: number | null;
          recognition_id?: string | null;
          rto_id?: string;
          vet_flag?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'qualifications_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      rtos: {
        Row: {
          address_line_1: string | null;
          contact_name: string | null;
          created_at: string;
          email_address: string | null;
          facsimile_number: string | null;
          id: string;
          name: string;
          phone_number: string | null;
          postcode: string | null;
          rto_code: string;
          state: string | null;
          statistical_area_1_id: string | null;
          statistical_area_2_id: string | null;
          suburb: string | null;
          type_identifier: string | null;
        };
        Insert: {
          address_line_1?: string | null;
          contact_name?: string | null;
          created_at?: string;
          email_address?: string | null;
          facsimile_number?: string | null;
          id?: string;
          name: string;
          phone_number?: string | null;
          postcode?: string | null;
          rto_code: string;
          state?: string | null;
          statistical_area_1_id?: string | null;
          statistical_area_2_id?: string | null;
          suburb?: string | null;
          type_identifier?: string | null;
        };
        Update: {
          address_line_1?: string | null;
          contact_name?: string | null;
          created_at?: string;
          email_address?: string | null;
          facsimile_number?: string | null;
          id?: string;
          name?: string;
          phone_number?: string | null;
          postcode?: string | null;
          rto_code?: string;
          state?: string | null;
          statistical_area_1_id?: string | null;
          statistical_area_2_id?: string | null;
          suburb?: string | null;
          type_identifier?: string | null;
        };
        Relationships: [];
      };
      students: {
        Row: {
          application_id: string | null;
          created_at: string;
          date_of_birth: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          rto_id: string;
          student_id_display: string;
        };
        Insert: {
          application_id?: string | null;
          created_at?: string;
          date_of_birth: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          rto_id: string;
          student_id_display: string;
        };
        Update: {
          application_id?: string | null;
          created_at?: string;
          date_of_birth?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          rto_id?: string;
          student_id_display?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'students_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'students_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      terms: {
        Row: {
          end_date: string;
          id: string;
          name: string;
          rto_id: string;
          start_date: string;
        };
        Insert: {
          end_date: string;
          id?: string;
          name: string;
          rto_id: string;
          start_date: string;
        };
        Update: {
          end_date?: string;
          id?: string;
          name?: string;
          rto_id?: string;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'terms_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
      unit_offerings: {
        Row: {
          end_date: string;
          id: string;
          median_date: string;
          rto_id: string;
          start_date: string;
          term_id: string;
          unit_id: string;
        };
        Insert: {
          end_date: string;
          id?: string;
          median_date: string;
          rto_id: string;
          start_date: string;
          term_id: string;
          unit_id: string;
        };
        Update: {
          end_date?: string;
          id?: string;
          median_date?: string;
          rto_id?: string;
          start_date?: string;
          term_id?: string;
          unit_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'unit_offerings_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'unit_offerings_term_id_fkey';
            columns: ['term_id'];
            isOneToOne: false;
            referencedRelation: 'terms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'unit_offerings_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'units_of_competency';
            referencedColumns: ['id'];
          },
        ];
      };
      units_of_competency: {
        Row: {
          code: string;
          created_at: string;
          field_of_education_id: string | null;
          id: string;
          name: string;
          nominal_hours: number | null;
          rto_id: string;
          vet_flag: string | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          field_of_education_id?: string | null;
          id?: string;
          name: string;
          nominal_hours?: number | null;
          rto_id: string;
          vet_flag?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          field_of_education_id?: string | null;
          id?: string;
          name?: string;
          nominal_hours?: number | null;
          rto_id?: string;
          vet_flag?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'units_of_competency_rto_id_fkey';
            columns: ['rto_id'];
            isOneToOne: false;
            referencedRelation: 'rtos';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_my_rto_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      application_status:
        | 'DRAFT'
        | 'SUBMITTED'
        | 'OFFER_GENERATED'
        | 'OFFER_SENT'
        | 'ACCEPTED'
        | 'REJECTED'
        | 'APPROVED';
      enrollment_status:
        | 'PENDING'
        | 'ACTIVE'
        | 'COMPLETED'
        | 'WITHDRAWN'
        | 'DEFERRED';
      invoice_status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID' | 'OVERDUE';
      user_role:
        | 'ADMISSIONS_OFFICER'
        | 'SENIOR_ADMISSIONS_OFFICER'
        | 'COMPLIANCE_MANAGER'
        | 'ACADEMIC_HEAD'
        | 'FINANCE_OFFICER'
        | 'ADMIN';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: [
        'DRAFT',
        'SUBMITTED',
        'OFFER_GENERATED',
        'OFFER_SENT',
        'ACCEPTED',
        'REJECTED',
        'APPROVED',
      ],
      enrollment_status: [
        'PENDING',
        'ACTIVE',
        'COMPLETED',
        'WITHDRAWN',
        'DEFERRED',
      ],
      invoice_status: ['DRAFT', 'SENT', 'PAID', 'VOID', 'OVERDUE'],
      user_role: [
        'ADMISSIONS_OFFICER',
        'SENIOR_ADMISSIONS_OFFICER',
        'COMPLIANCE_MANAGER',
        'ACADEMIC_HEAD',
        'FINANCE_OFFICER',
        'ADMIN',
      ],
    },
  },
} as const;
