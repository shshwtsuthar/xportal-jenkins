### **XPortal Design System & UI Generation Rules**

**[i] INFO FOR AI TOOL:** This document is the single source of truth for all UI/UX design and component generation in the XPortal project. Adhere to these rules strictly to ensure a consistent, homogenous, and professional user interface. The target aesthetic is inspired by Vercel, v0.dev, and the Geist Design System: minimalist, functional, typography-focused, and clean.

---

### **1. Core Principles (The Vercel Aesthetic)**

- **Function Over Form:** The UI is a professional tool. Clarity and usability are the top priorities. Avoid decorative elements that don't serve a purpose.
- **Whitespace is an Active Element:** Use generous padding and margins to create a clean, uncluttered layout. Let the content breathe.
- **Typography is the Interface:** We use the Geist font. The hierarchy, weight, and color of text are the primary ways we guide the user.
- **Subtlety and Constraint:** Animations are minimal and purposeful (e.g., subtle fades, transitions). The color palette is constrained and used semantically.

---

### **2. Layout & Page Structure**

- **Root Layout:** The application uses a main layout with a fixed left sidebar and a main content area.
  - **Sidebar:** Has a `border-r` and uses the `bg-muted/10` or a similar subtle background to differentiate it from the main content.
  - **Main Content Area:** Use a standard padding of `p-4 md:p-6 lg:p-8` on all pages.
- **Page Headers:** Every page must begin with a clear header.
  - The primary page title uses an `<h1>` tag with the Tailwind classes `text-2xl font-semibold tracking-tight`.
  - Optionally, a subtitle or description can be placed below the title using `<p class="text-sm text-muted-foreground">`.
  - Any primary page-level actions (e.g., "Create New Application") should be placed in the header, aligned to the right, using a `<Button>`.
- **Content Organization:** Use the `<Card>` component as the primary container for distinct sections of content on a page. Do not have floating forms or tables without a container.

---

### **3. Color & Theme**

Use the ShadCN theme colors semantically. **Never use raw hex codes.**

- `background`: The default background color for the main content area.
- `foreground`: The default text color.
- `card`: The background color for all `<Card>` components.
- `card-foreground`: The text color inside `<Card>` components.
- `primary`: For primary buttons, active links, and highlighted elements.
- `secondary`: For secondary buttons and less important interactive elements.
- `muted`: For subtle backgrounds (like the sidebar) and borders.
- `muted-foreground`: For secondary text, descriptions, and disabled text.
- `destructive`: **Exclusively** for buttons, icons, and text related to destructive actions (e.g., Delete, Remove, Cancel).
- `border`: The color for all borders (e.g., on `<Card>`, `<Input>`, and table cells).

---

### **4. Typography (Using Geist Font)**

Adhere to a strict typographic scale.

- **Page Titles:** `<h1>` - `text-2xl font-semibold tracking-tight`
- **Section/Card Titles:** `<h2>` or `<CardTitle>` - `text-xl font-semibold tracking-tight`
- **Sub-Headings:** `<h3>` - `text-lg font-medium`
- **Body Text:** `<p>` - `text-base` (default)
- **Small/Muted Text:** `<p class="text-sm text-muted-foreground">` - For helper text, captions, and descriptions.
- **Labels:** Use the `<Label>` component for all form inputs.

---

### **5. Component Usage Rules (The Playbook)**

This is the most critical section. Follow these component patterns precisely.

#### **User Input & Forms:**

- **Container:** Always wrap forms in a `<Card>` component. Use `<CardHeader>`, `<CardContent>`, and `<CardFooter>`.
- **Fields:** Every input must have an associated `<Label>`. Use the standard `<Input>` for text, numbers, and email. Use `<Textarea>` for multi-line text.
- **Selection:** Use `<Select>` for a list of 3-10 predefined options. Use `<RadioGroup>` for 2-4 mutually exclusive options. Use `<Checkbox>` for on/off toggles.
- **Buttons:**
  - The primary form submission button is always the **default** variant and is placed in the `<CardFooter>`, aligned to the right.
  - Secondary actions (e.g., "Cancel") use the `outline` or `ghost` variant and are placed to the left of the primary button.
  - Destructive actions (e.g., "Delete Student") use the `destructive` variant.

#### **Displaying Data:**

- **Tables:** Use the ShadCN `<Table>` component for all tabular data.
  - Table headers (`<TableHeader>`) should use `font-medium`.
  - Align text-based columns to the left. Align numeric columns to the right.
  - Use a `<DropdownMenu>` within a table row for row-specific actions (e.g., Edit, Delete).
- **Status Indicators:** Use the `<Badge>` component for all status indicators (e.g., "Active", "Draft", "Paid").
  - Use the default variant for neutral/positive statuses.
  - Use the `destructive` variant for negative statuses ("Rejected", "Overdue").
  - Use the `secondary` variant for neutral, non-active statuses ("Completed", "Archived").
- **Key-Value Data:** For displaying a list of details (like on a student's profile page), do not use a form. Use a simple two-column grid with descriptive labels and values.

#### **Feedback & Notifications:**

- **Toasts:** Use `sonner` for all asynchronous feedback (e.g., "Application submitted successfully," "Failed to update record"). Toasts appear at the bottom-right of the screen.
- **Alerts:** Use the `<Alert>` component for static, contextual information on a page (e.g., "This student has an overdue invoice."). Use the `destructive` variant for critical warnings.
- **Dialogs:** Use `<Dialog>` or `<AlertDialog>` for actions that require explicit user confirmation, especially destructive ones. The `<AlertDialog>` is preferred for deletions as it provides the standard "Are you sure?" flow.

---

### **6. Iconography**

- **Library:** Use **`lucide-react`** exclusively for all icons.
- **Sizing:** Icons inside buttons or next to text should be small: `h-4 w-4` (`16px`).
- **Stroke Width:** Use the default stroke width of `2`, but you may use `1.5` for a lighter feel if consistent.
- **Usage:** Use icons to add clarity, not decoration. A "Create" button should have a `Plus` icon. A "Delete" action should have a `Trash` icon.

---

### **The Golden Rule**

When in doubt, ask: **"What would the Vercel dashboard do?"** Strive for that level of polish, clarity, and functional minimalism.
