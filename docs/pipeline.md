### **The XPortal Development Manifesto**

Before the pipeline, internalize these four guiding principles. Every decision you make should align with them.

1.  **The Database is the Single Source of Truth.** The schema is the contract. All features, logic, and UI are built to serve the data model, not the other way around.
2.  **Backend-First, Always.** The logic must be built and tested before a single pixel is drawn for it. An Edge Function must work perfectly when tested in isolation before you build a UI to call it.
3.  **Type Safety is Non-Negotiable.** Your `database.ts` file is your best friend. It's your automated code reviewer that catches errors before they happen. It must _always_ be in sync with your schema.
4.  **Commit Small, Commit Often.** Git is your undo button and your project diary. Every logical change, no matter how small, is a commit. This is your safety net.

---

### **Strategic Decisions: OpenAPI and Testing**

Let's address your high-level questions first, as they define the pipeline's structure.

#### **Should I make an OpenAPI.yaml file?**

**No, and this is a strategic advantage.**

For your stack, a manually maintained OpenAPI file is redundant and a source of errors. Here’s why:

- **For PostgREST:** The API is generated _from your database schema_. The schema _is_ the contract. Manually documenting it is duplicating work.
- **For Your Workflow:** The command `supabase gen types typescript` reads your schema and generates perfect TypeScript types. This is a **live, automated contract** that is far more powerful than a static YAML file. If you change a database column, TypeScript will immediately throw an error in your Next.js code. This is the robust, homogenous flow you want.

**Your contract is your `database.ts` file, automatically generated from the true source of truth: your SQL migrations.**

#### **Should I do testing?**

**Yes. Absolutely.** As a solo developer, automated testing isn't a luxury; it's a necessity. It's your quality assurance team. But you must be strategic.

1.  **Backend Unit/Integration Tests (High Priority):** For every Deno Edge Function you write, you will write a corresponding test file. Deno has a built-in test runner. These tests will ensure your core business logic (e.g., application validation, payment calculations) is correct, independent of the UI.
2.  **End-to-End (E2E) Tests (High Priority):** Use a tool like **Playwright**. These tests simulate a real user in a real browser. You will write E2E tests for your most critical user flows (e.g., "Can a user successfully fill out and submit the New Application wizard?", "Does a rejected application show up in the correct dashboard tab?"). This is how you verify that the _entire system_ (UI -> API -> DB) works together.
3.  **UI Component Tests (Lower Priority):** For a solo developer using a robust library like ShadCN, testing every simple component is not a good use of time. Only write component tests for highly complex, custom components you build yourself that have a lot of internal logic.

---

### **The Concrete Daily Development Pipeline**

This is the step-by-step flow for implementing **any** new feature, from a tiny UI tweak to a major new module.

#### **Case Study: "I want to track a user's default campus preference in their profile."**

---

#### **Phase 1: The Foundation (Database)**

- **Goal:** Modify the database schema to support the new feature.

1.  **Create a New Migration:** Open your terminal in your project root.
    ```bash
    supabase migration new "add_default_campus_to_profiles"
    ```
2.  **Write the SQL:** Open the newly created SQL file in `supabase/migrations/`. Add the necessary schema change.
    ```sql
    -- supabase/migrations/xxxxxxxx_add_default_campus_to_profiles.sql
    ALTER TABLE public.profiles
    ADD COLUMN default_campus_id UUID REFERENCES public.delivery_locations(id);
    ```
3.  **Apply and Verify Locally:** Reset your local database to apply all migrations, including the new one.
    ```bash
    supabase db reset
    ```
    Quickly open Supabase Studio and check that the `profiles` table now has the `default_campus_id` column.

---

#### **Phase 2: The Contract (Type Generation)**

- **Goal:** Make your Next.js application aware of the schema change.

1.  **Generate Types:** Run the type generator.
    ```bash
    supabase gen types typescript --local > src/types/database.ts
    ```
    This is a **non-negotiable** step after every migration. Your application now knows, in a type-safe way, that a `Profile` can have a `default_campus_id`.

---

#### **Phase 3: The Logic (API Layer)**

- **Goal:** Create or verify the API for interacting with the new data.

1.  **Analyze the Requirement:** The feature is "set a default campus." This is a simple update to a single field.
2.  **Choose the Right Tool:** This does **not** require a complex Edge Function. The standard PostgREST API provided by Supabase is perfect. You will use the `supabase-js` client's `.update()` method. No backend code needs to be written.

---

#### **Phase 4: The Interface (UI Layer)**

- **Goal:** Build the user-facing component for the feature.

1.  **Build the Component:** In your Next.js app, go to the user profile page.
2.  **Fetch the Data:** Use the Supabase client to fetch the current user's profile data, including the `default_campus_id`.
3.  **Create the UI:** Use a ShadCN `<Select>` component to list all available delivery locations (which you fetch from the `delivery_locations` table). The value of the select should be bound to the `default_campus_id` from the user's profile.
4.  **Implement the Update:** When the user changes the selection, trigger an `async` function that uses the Supabase client:

    ```typescript
    // Example of the update logic
    const { error } = await supabase
      .from('profiles')
      .update({ default_campus_id: newCampusId })
      .eq('id', userId);

    if (error) {
      // Show a toast notification for the error
    } else {
      // Show a success toast
    }
    ```

---

#### **Phase 5: Verification (Testing)**

- **Goal:** Prove that the entire feature works correctly and won't break in the future.

1.  **Write an E2E Test:** Open your Playwright test suite. Write a new test case named `profile-settings.spec.ts`.
    - The test will log in as a test user.
    - Navigate to the profile page.
    - Select a new campus from the dropdown.
    - Verify that the success toast appears.
    - **Reload the page.**
    - Verify that the dropdown still shows the newly selected campus, proving the data was persisted correctly.
2.  **Run the Test:** Execute your E2E test suite and watch it pass.

---

#### **Phase 6: Integration (Version Control)**

- **Goal:** Safely save your completed work.

1.  **Commit Your Work:** You have touched several parts of the codebase. Now, commit them as one logical unit.
    ```bash
    git add .
    git commit -m "feat(profile): allow users to set a default campus preference"
    ```

You have now completed one full, robust development cycle. This process is repeatable, testable, and ensures every part of your stack is perfectly synchronized. This is how you build a complex application, alone, without losing control.

### **AI-Assisted Development Pipeline for XPortal**

**[i] INFO FOR AI TOOL:** This document outlines the standard operating procedure for all feature development in the XPortal project. Follow these steps sequentially. The tech stack is Next.js, Supabase, ShadCN, TanStack Query for data fetching, and Playwright for testing. The core principles are: The Database is the Single Source of Truth, and Type Safety is Non-Negotiable.

---

#### **FEATURE REQUEST:**

Allow a user to set a "Default Campus" preference on their profile page. This preference should be saved and reflected upon page reload.

---

### **Step 1: The Foundation (Database Migration)**

**[i] INFO:** The first step is always to modify the database schema to support the new feature.

1.  **Create a new migration file.** Execute this command in the terminal:

    ```bash
    supabase migration new "add_default_campus_to_profiles"
    ```

2.  **Populate the migration file.** Open the newly created SQL file and insert the following code to add the new column to the `profiles` table:

    ```sql
    -- supabase/migrations/xxxxxxxx_add_default_campus_to_profiles.sql
    ALTER TABLE public.profiles
    ADD COLUMN default_campus_id UUID REFERENCES public.delivery_locations(id);

    COMMENT ON COLUMN public.profiles.default_campus_id IS 'Stores the user''s preferred default campus for UI purposes.';
    ```

3.  **Apply the migration to the local database.** Execute this command in the terminal:
    ```bash
    supabase db reset
    ```

**[> Human Task]**

- I will now visually verify the schema change in Supabase Studio to ensure the `default_campus_id` column exists on the `profiles` table.

---

### **Step 2: The Contract (Type Generation)**

**[i] INFO:** The application's frontend must be made aware of the schema change. This is our type-safe contract.

1.  **Generate TypeScript types from the database schema.** Execute this command in the terminal:
    ```bash
    supabase gen types typescript --local > database.types.ts
    ```

---

### **Step 3: The Logic (API Layer: Hooks & Frontend Types)**

**[i] INFO:** Now, create the necessary data-fetching logic and frontend types. We use a standardized pattern with TanStack Query for reusable hooks.

1.  **Create the data-fetching hook.** In the `hooks/` directory, create a file named `useGetProfile.ts`. This hook will fetch the profile data for a specific user.

    ```typescript
    // src/hooks/useGetProfile.ts
    import { useQuery } from '@tanstack/react-query';
    import { supabase } from '@/lib/supabaseClient';
    import { Tables } from '@/database.types';

    export const useGetProfile = (userId: string) => {
      return useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            throw new Error(error.message);
          }
          return data;
        },
        enabled: !!userId, // Only run the query if the userId is available
      });
    };
    ```

2.  **Define the component's props type.** In the component file where the UI will be built (e.g., `ProfileForm.tsx`), derive the props type from our master `database.types.ts` file. This ensures the component expects the correct data shape.

    ```typescript
    // src/components/ProfileForm.tsx
    import { Tables } from '@/database.types';

    type ProfileFormProps = {
      profile: Tables<'profiles'>;
    };

    // ... component implementation will follow in the next step
    ```

---

### **Step 4: The Interface (UI Layer)**

**[i] INFO:** Build the React component using ShadCN. The component should use the hook created in the previous step to fetch data and then use the Supabase client to update it.

1.  **Build the `ProfileForm` component.** Create the file `src/components/ProfileForm.tsx`.
    - It should accept the `profile` object as a prop.
    - Use the ShadCN `<Select>` component to display a list of available delivery locations (fetched from the `delivery_locations` table).
    - The `<Select>` component's value should be controlled by the `profile.default_campus_id`.
    - On selection change, trigger an `onUpdate` function that uses the Supabase client to update the `profiles` table.
    - Use the ShadCN `sonner` component to show success or error toast notifications.

    ```typescript
    // src/components/ProfileForm.tsx
    // (You can now generate the full component based on the instructions above)
    // ...
    // Example of the update logic to include:
    const handleCampusUpdate = async (newCampusId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ default_campus_id: newCampusId })
        .eq('id', profile.id);

      if (error) {
        toast.error('Failed to update default campus.');
      } else {
        toast.success('Default campus updated successfully!');
      }
    };
    // ...
    ```

---

### **Step 5: Verification (Testing)**

**[> Human Task]**

- I will now write and run tests for this feature. This is a manual process.
- **E2E Test:** I will create a new Playwright test file (`profile-settings.spec.ts`).
  - The test will log in.
  - Navigate to the profile page.
  - Change the default campus selection.
  - Verify the success toast appears.
  - Reload the page and assert that the new selection has been persisted.

---

### **Step 6: Integration (Version Control)**

**[> Human Task]**

- I will now commit the completed and tested work to the Git repository. This is a manual process.
- I will review the staged changes and write a clear, conventional commit message.
  ```bash
  git add .
  git commit -m "feat(profile): allow users to set a default campus preference"
  ```
