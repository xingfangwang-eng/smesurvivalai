import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  name: string;
  industry: string;
  businessSize: string;
  email: string;
  biggestStruggle: string;
  calculatorData?: {
    staffCount: number;
    averageWage: number;
    selectedSolution: string;
    monthlySavings: number;
    annualSavings: number;
    roiPercentage: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const leadData: LeadData = await request.json();

    console.log('Lead received:', leadData);

    // Get Airtable credentials from environment variables
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

    if (!airtableBaseId || !airtableApiKey || !airtableTableName) {
      console.error('Airtable credentials not configured');
      return NextResponse.json(
        { error: 'Airtable credentials not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: leadData.name,
              Industry: leadData.industry,
              BusinessSize: leadData.businessSize,
              Email: leadData.email,
              BiggestStruggle: leadData.biggestStruggle,
              StaffCount: leadData.calculatorData?.staffCount || 0,
              AverageWage: leadData.calculatorData?.averageWage || 0,
              SelectedSolution: leadData.calculatorData?.selectedSolution || '',
              MonthlySavings: leadData.calculatorData?.monthlySavings || 0,
              AnnualSavings: leadData.calculatorData?.annualSavings || 0,
              ROIPercentage: leadData.calculatorData?.roiPercentage || 0,
              SubmittedAt: new Date().toISOString(),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable error:', errorData);
      return NextResponse.json(
        { error: 'Failed to save lead to Airtable', details: errorData },
        { status: 500 }
      );
    }

    const airtableResponse = await response.json();
    console.log('Lead saved to Airtable:', airtableResponse);

    return NextResponse.json(
      { success: true, message: 'Lead captured successfully', recordId: airtableResponse.records[0].id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}