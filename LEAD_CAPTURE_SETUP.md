# Lead Capture Integration Setup

This guide explains how to connect the lead capture form to either Airtable or Supabase.

## Option 1: Airtable Integration

### 1. Create an Airtable Account
- Sign up at [airtable.com](https://airtable.com)
- Create a new base and table for leads

### 2. Get Your API Credentials
- Go to [Airtable API documentation](https://airtable.com/developers/web/api/introduction)
- Generate an API key from your account settings
- Find your Base ID in the API documentation

### 3. Configure Your Table
Create a table with the following fields:
- Name (Single line text)
- Industry (Single select)
- BusinessSize (Single select)
- Email (Email)
- BiggestStruggle (Long text)
- StaffCount (Number)
- AverageWage (Number)
- SelectedSolution (Single line text)
- MonthlySavings (Currency)
- AnnualSavings (Currency)
- ROIPercentage (Number)
- SubmittedAt (Date)

### 4. Update the API Route
Edit `src/app/api/leads/route.ts`:
```typescript
const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
const AIRTABLE_BASE_ID = 'YOUR_BASE_ID';
const AIRTABLE_TABLE_NAME = 'YOUR_TABLE_NAME';
```

## Option 2: Supabase Integration

### 1. Create a Supabase Account
- Sign up at [supabase.com](https://supabase.com)
- Create a new project

### 2. Set Up the Database
Run this SQL in your Supabase SQL editor:
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  business_size TEXT NOT NULL,
  email TEXT NOT NULL,
  biggest_struggle TEXT NOT NULL,
  staff_count INTEGER DEFAULT 0,
  average_wage INTEGER DEFAULT 0,
  selected_solution TEXT,
  monthly_savings DECIMAL DEFAULT 0,
  annual_savings DECIMAL DEFAULT 0,
  roi_percentage DECIMAL DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Allow public insert" ON leads
FOR INSERT WITH CHECK (true);
```

### 3. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 4. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Update the API Route
Replace `src/app/api/leads/route.ts` with the Supabase version from `src/app/api/leads/supabase-route.ts`

## Testing the Integration

1. Start the development server:
```bash
npm run dev
```

2. Navigate to [http://localhost:3000/calculator](http://localhost:3000/calculator)

3. Fill out the calculator and click "Download My Custom AI Strategy"

4. Complete the lead capture form

5. Check your database for the new lead entry

## Lead Data Structure

When a user submits the form, the following data is captured:

**User Information:**
- Name
- Industry
- Business Size
- Email
- Biggest Cost Struggle

**Calculator Data:**
- Staff Count
- Average Wage
- Selected AI Solution
- Monthly Savings
- Annual Savings
- ROI Percentage

**Metadata:**
- Submission timestamp

## Customization

You can customize the lead capture form by editing:
- `src/components/LeadCaptureForm.tsx` - Form fields and validation
- `src/app/calculator/page.tsx` - Form submission logic
- `src/app/api/leads/route.ts` - API endpoint logic

## Security Considerations

- Always use environment variables for API keys
- Implement rate limiting on the API endpoint
- Validate and sanitize all input data
- Consider adding CAPTCHA to prevent spam
- Use HTTPS in production