'use client';

import { Calculator } from './Calculator';

interface CalculatorWrapperProps {
  industry: string;
  subSector: string;
  onSavingsCalculated?: (savings: number) => void;
}

export function CalculatorWrapper({ industry, subSector, onSavingsCalculated }: CalculatorWrapperProps) {
  return (
    <div className="min-h-[600px] sm:min-h-[650px] lg:min-h-[700px]">
      <Calculator industry={industry} subSector={subSector} onSavingsCalculated={onSavingsCalculated} />
    </div>
  );
}
