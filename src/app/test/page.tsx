'use client';

import { useState } from 'react';
import { RecommendedAutomationStack } from '../../components/RecommendedAutomationStack';

export default function TestPage() {
  const [annualSavings, setAnnualSavings] = useState<number>(50000);
  const [showHighlight, setShowHighlight] = useState<boolean>(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Recommended Automation Stack</h1>
      
      <RecommendedAutomationStack 
        industry="Catering & Food Service" 
        annualSavings={annualSavings} 
        showHighlight={showHighlight} 
      />
    </div>
  );
}