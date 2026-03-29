'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LeadCaptureFormProps {
  onClose: () => void;
  industry: string;
  subSector: string;
  savingsData: {
    monthlySavings: number;
    annualSavings: number;
    efficiencyIncrease: number;
    staffCount: number;
    averageWage: number;
    automationRate: number;
  };
}

interface LeadFormData {
  name: string;
  email: string;
  industry: string;
  businessSize: string;
  costStruggles: string[];
  message: string;
}

export function LeadCaptureForm({ onClose, industry, subSector, savingsData }: LeadCaptureFormProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    industry: industry,
    businessSize: '',
    costStruggles: [],
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      costStruggles: prev.costStruggles.includes(value)
        ? prev.costStruggles.filter(item => item !== value)
        : [...prev.costStruggles, value]
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      businessSize: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const hasSupabaseConfig = supabaseUrl && supabaseKey;

      if (hasSupabaseConfig) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data, error } = await supabase
          .from('leads')
          .insert({
            ...formData,
            sub_sector: subSector,
            monthly_savings: savingsData.monthlySavings,
            annual_savings: savingsData.annualSavings,
            efficiency_increase: savingsData.efficiencyIncrease,
            staff_count: savingsData.staffCount,
            average_wage: savingsData.averageWage,
            automation_rate: savingsData.automationRate,
            created_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error submitting lead:', error);
        } else {
          setSubmissionSuccess(true);
          setTimeout(() => {
            setSubmissionSuccess(false);
            onClose();
          }, 3000);
        }
      } else {
        // Simulate submission for demo purposes
        console.log('Lead data (demo mode):', {
          ...formData,
          sub_sector: subSector,
          monthly_savings: savingsData.monthlySavings,
          annual_savings: savingsData.annualSavings,
          efficiency_increase: savingsData.efficiencyIncrease,
          staff_count: savingsData.staffCount,
          average_wage: savingsData.averageWage,
          automation_rate: savingsData.automationRate,
          created_at: new Date().toISOString(),
        });
        
        setSubmissionSuccess(true);
        setTimeout(() => {
          setSubmissionSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (submissionSuccess) {
    return (
      <Card className="max-w-md mx-auto p-4 sm:p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">Submission Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-base sm:text-lg">Report has been sent to your email</p>
          <p className="text-sm sm:text-base text-gray-600">
            Our experts will contact you within 24 hours to provide your customized AI solution.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-4 sm:p-6">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Get Full Industry Optimization Report</CardTitle>
        <p className="text-sm sm:text-base text-gray-600">
          Fill in the following information and we'll send you a customized AI solution report
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 sm:h-auto text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 sm:h-auto text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <Input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 sm:h-auto text-base"
                />
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={nextStep} className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-6 text-base sm:text-lg">
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Size
                </label>
                <Select value={formData.businessSize} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full h-12 sm:h-auto text-base">
                    <SelectValue placeholder="Select business size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201+">201+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your biggest cost struggles (multiple choices allowed)
                </label>
                <div className="space-y-2 sm:space-y-2">
                  <div className="flex items-center space-x-2 sm:space-x-2">
                    <Checkbox
                      id="labor-costs"
                      checked={formData.costStruggles.includes('labor-costs')}
                      onCheckedChange={() => handleCheckboxChange('labor-costs')}
                    />
                    <label htmlFor="labor-costs" className="text-sm sm:text-base text-gray-700">
                      Labor costs
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-2">
                    <Checkbox
                      id="operational-costs"
                      checked={formData.costStruggles.includes('operational-costs')}
                      onCheckedChange={() => handleCheckboxChange('operational-costs')}
                    />
                    <label htmlFor="operational-costs" className="text-sm sm:text-base text-gray-700">
                      Operational costs
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-2">
                    <Checkbox
                      id="energy-costs"
                      checked={formData.costStruggles.includes('energy-costs')}
                      onCheckedChange={() => handleCheckboxChange('energy-costs')}
                    />
                    <label htmlFor="energy-costs" className="text-sm sm:text-base text-gray-700">
                      Energy costs
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-2">
                    <Checkbox
                      id="inventory-costs"
                      checked={formData.costStruggles.includes('inventory-costs')}
                      onCheckedChange={() => handleCheckboxChange('inventory-costs')}
                    />
                    <label htmlFor="inventory-costs" className="text-sm sm:text-base text-gray-700">
                      Inventory costs
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other cost struggles
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe other cost struggles you're facing"
                  className="w-full text-base"
                />
              </div>
              <div className="flex justify-between gap-2 sm:gap-4">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 sm:flex-none px-6 py-3 sm:px-8 sm:py-6 text-base sm:text-lg">
                  Previous
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none px-6 py-3 sm:px-8 sm:py-6 text-base sm:text-lg">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
