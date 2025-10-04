/// <reference lib="deno.ns" />

//
// XPortal - Submit Application Edge Function
//
// This function is responsible for the critical business logic of submitting a new application.
// It performs server-side validation of all mandatory AVETMISS fields before
// transitioning the application's status from 'DRAFT' to 'SUBMITTED'.
//

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Type Imports ---
// Import the auto-generated TypeScript types for your database.
// For this to work, you must have a copy of your `database.types.ts` file
// in the `supabase/functions/_shared/` directory.
import { Database } from '../_shared/database.types.ts';

// Define a specific type for an application row for cleaner code.
type Application = Database['public']['Tables']['applications']['Row'];

// --- CORS Configuration ---
// Define CORS headers to allow requests from your web application.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, you should restrict this to your domain.
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Validates an application object against mandatory AVETMISS business rules.
 * This function is the primary quality gate for compliance.
 * @param application - The full application object to validate.
 * @returns An array of human-readable error strings. An empty array signifies a valid application.
 */
function validateApplication(application: Application): string[] {
  const errors: string[] = [];

  // Helper to check for null, undefined, or empty string values.
  const checkRequired = (value: unknown, fieldName: string) => {
    if (value === null || value === undefined || value === '') {
      errors.push(`${fieldName} is a required field.`);
    }
  };

  // --- NAT00080 & NAT00085 Field Validation ---
  checkRequired(application.first_name, 'First Name');
  checkRequired(application.last_name, 'Last Name');
  checkRequired(application.date_of_birth, 'Date of Birth');
  checkRequired(application.address_line_1, 'Address Line 1');
  checkRequired(application.suburb, 'Suburb');
  checkRequired(application.state, 'State');
  checkRequired(application.postcode, 'Postcode');
  checkRequired(application.gender, 'Gender');
  checkRequired(application.highest_school_level_id, 'Highest School Level');
  checkRequired(application.indigenous_status_id, 'Indigenous Status');
  checkRequired(application.labour_force_status_id, 'Labour Force Status');
  checkRequired(application.country_of_birth_id, 'Country of Birth');
  checkRequired(application.language_code, 'Main Language Spoken at Home');
  checkRequired(application.citizenship_status_code, 'Citizenship Status');
  checkRequired(application.at_school_flag, 'At School Status');

  // --- Conditional Validation based on student type ---
  if (application.is_international) {
    checkRequired(
      application.passport_number,
      'Passport Number (for international students)'
    );
    checkRequired(
      application.visa_type,
      'Visa Type (for international students)'
    );
  } else {
    // Domestic students require a USI.
    checkRequired(
      application.usi,
      'Unique Student Identifier (USI) (for domestic students)'
    );
  }

  return errors;
}

/**
 * The main Deno request handler.
 */
serve(async (req) => {
  // This is a standard requirement for CORS-enabled routes.
  // It handles the preflight request sent by the browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Create a Supabase client with the user's authentication context.
    // This is a critical security step that ensures all database operations
    // respect your Row-Level Security policies.
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // 2. Extract the `applicationId` from the request body.
    const { applicationId } = await req.json();
    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: 'applicationId is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400, // Bad Request
        }
      );
    }

    // 3. Fetch the application data from the database.
    const { data: application, error: fetchError } = await supabaseClient
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError) {
      console.error(
        `Fetch Error for application ID ${applicationId}:`,
        fetchError.message
      );
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404, // Not Found
      });
    }

    // 4. Perform business rule validation.
    // Rule: An application can only be submitted if it's currently a 'DRAFT'.
    if (application.status !== 'DRAFT') {
      return new Response(
        JSON.stringify({
          error: `Application is already in '${application.status}' status and cannot be submitted again.`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409, // Conflict - indicates a state mismatch.
        }
      );
    }

    // Rule: The application must pass all AVETMISS validation checks.
    const validationErrors = validateApplication(application);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: validationErrors,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400, // Bad Request
        }
      );
    }

    // 5. If all validation passes, update the application status to 'SUBMITTED'.
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({ status: 'SUBMITTED' })
      .eq('id', applicationId);

    if (updateError) {
      console.error(
        `Update Error for application ID ${applicationId}:`,
        updateError.message
      );
      // This is a server-side issue, so we throw to trigger the 500 error handler.
      throw new Error('Failed to update application status in the database.');
    }

    // 6. Return a success response to the client.
    return new Response(
      JSON.stringify({ message: 'Application submitted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // OK
      }
    );
  } catch (error) {
    // Type-safe error handling.
    // We check if the caught object is an instance of Error before accessing .message.
    if (error instanceof Error) {
      console.error('Unexpected Error:', error.message);
    } else {
      // If something else was thrown (e.g., a string or object), log it directly.
      console.error('An unexpected non-Error value was thrown:', error);
    }

    return new Response(
      JSON.stringify({ error: 'An internal server error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500, // Internal Server Error
      }
    );
  }
});
