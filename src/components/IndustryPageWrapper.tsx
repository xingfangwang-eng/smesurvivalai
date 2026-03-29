'use client';

import React, { useState } from 'react';
import { CalculatorWrapper } from './CalculatorWrapper';
import { RecommendedAutomationStack } from './RecommendedAutomationStack';

interface IndustryPageWrapperProps {
  industry: string;
  subSector: string;
  children: React.ReactNode;
}

export function IndustryPageWrapper({ industry, subSector, children }: IndustryPageWrapperProps) {
  const [annualSavings, setAnnualSavings] = useState<number>(0);
  const [showHighlight, setShowHighlight] = useState<boolean>(false);

  const handleSavingsCalculated = (savings: number) => {
    setAnnualSavings(savings);
    setShowHighlight(true);
  };

  return (
    <div>
      {/* ROI Calculator */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <CalculatorWrapper 
          industry={industry} 
          subSector={subSector} 
          onSavingsCalculated={handleSavingsCalculated} 
        />
      </div>

      {/* Report Content */}
      {children}

      {/* Recommended Automation Stack */}
      <RecommendedAutomationStack 
        industry={industry} 
        annualSavings={annualSavings} 
        showHighlight={showHighlight} 
      />
    </div>
  );
}