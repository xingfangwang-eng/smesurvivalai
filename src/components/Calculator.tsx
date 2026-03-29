'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LeadCaptureForm } from './LeadCaptureForm';

interface CalculatorProps {
  industry: string;
  subSector: string;
  onSavingsCalculated?: (savings: number) => void;
}

export function Calculator({ industry, subSector, onSavingsCalculated }: CalculatorProps) {
  const [staffCount, setStaffCount] = useState<number>(1);
  const [averageWage, setAverageWage] = useState<number>(25);
  const [automationRate, setAutomationRate] = useState<number>(30);
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [annualSavings, setAnnualSavings] = useState<number>(0);
  const [efficiencyIncrease, setEfficiencyIncrease] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Refs for animation
  const monthlySavingsRef = useRef<HTMLParagraphElement>(null);
  const annualSavingsRef = useRef<HTMLParagraphElement>(null);
  const efficiencyRef = useRef<HTMLParagraphElement>(null);

  // Calculate savings function
  const calculateSavings = () => {
    setIsCalculating(true);
    
    // Calculate monthly savings based on staff count, average wage, and automation rate
    const monthlySavingsValue = staffCount * averageWage * 160 * (automationRate / 100);
    const annualSavingsValue = monthlySavingsValue * 12;
    const efficiencyIncreaseValue = automationRate * 1.5; // Assume 1.5x efficiency increase for automated tasks

    // Animate the values
    animateValue(setMonthlySavings, 0, monthlySavingsValue, 1500);
    animateValue(setAnnualSavings, 0, annualSavingsValue, 1800);
    animateValue(setEfficiencyIncrease, 0, efficiencyIncreaseValue, 1200);
    
    setTimeout(() => {
      setIsCalculating(false);
      setShowResults(true);
      // Call the callback with annual savings
      if (onSavingsCalculated) {
        onSavingsCalculated(annualSavingsValue);
      }
    }, 1800);
  };

  // Real-time calculation when inputs change
  useEffect(() => {
    if (showResults) {
      calculateSavings();
    }
  }, [staffCount, averageWage, automationRate]);

  // Animation function for smooth value transitions
  const animateValue = (setter: React.Dispatch<React.SetStateAction<number>>, start: number, end: number, duration: number) => {
    let startTime: number | null = null;
    
    const animation = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing function for more natural animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setter(Math.floor(start + (end - start) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  };

  const handleDownloadReport = () => {
    setShowLeadForm(true);
  };

  return (
    <Card className="border-primary/20 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardTitle className="text-2xl font-bold">AI Cost Reduction Calculator</CardTitle>
        <p className="text-white/90">
          Custom AI automation solution for {subSector}
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Number of Employees
            </label>
            <Input
              type="number"
              min="1"
              value={staffCount}
              onChange={(e) => setStaffCount(Number(e.target.value))}
              className="w-full border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 sm:h-auto text-lg"
            />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Average Hourly Wage ($)
            </label>
            <Input
              type="number"
              min="1"
              value={averageWage}
              onChange={(e) => setAverageWage(Number(e.target.value))}
              className="w-full border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 sm:h-auto text-lg"
            />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              AI Automation Rate (%)
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={automationRate}
              onChange={(e) => setAutomationRate(Number(e.target.value))}
              className="w-full border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 sm:h-auto text-lg"
            />
          </div>
        </div>

        <div className="flex justify-center mb-6 sm:mb-10">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto min-h-[56px] sm:min-h-0"
            onClick={calculateSavings}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              'Calculate Potential Savings'
            )}
          </Button>
        </div>

        {showResults && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10 shadow-lg transform transition-all duration-500 animate-fadeIn">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 text-center">Financial Impact Analysis</h3>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-lg border border-green-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Monthly Savings</p>
                  <p ref={monthlySavingsRef} className="text-2xl sm:text-3xl font-bold text-green-700">
                    ${monthlySavings.toLocaleString()}
                  </p>
                  <div className="mt-3 sm:mt-4 h-1 bg-green-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 transition-all duration-1500 ease-out-quart"
                      style={{ width: `${Math.min(monthlySavings / 10000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Annual Savings</p>
                  <p ref={annualSavingsRef} className="text-2xl sm:text-3xl font-bold text-blue-700">
                    ${annualSavings.toLocaleString()}
                  </p>
                  <div className="mt-3 sm:mt-4 h-1 bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1800 ease-out-quart"
                      style={{ width: `${Math.min(annualSavings / 100000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg border border-purple-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Efficiency Increase</p>
                  <p ref={efficiencyRef} className="text-2xl sm:text-3xl font-bold text-purple-700">
                    {efficiencyIncrease.toFixed(0)}%
                  </p>
                  <div className="mt-3 sm:mt-4 h-1 bg-purple-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 transition-all duration-1200 ease-out-quart"
                      style={{ width: `${efficiencyIncrease}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs sm:text-sm text-primary font-medium">
                * Based on industry averages and AI automation benchmarks. Actual results may vary.
              </p>
            </div>
          </div>
        )}

        {showResults && (
          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto min-h-[56px] sm:min-h-0"
              onClick={handleDownloadReport}
            >
              Get Full Industry Optimization Report
            </Button>
          </div>
        )}

        {showLeadForm && (
          <LeadCaptureForm
            onClose={() => setShowLeadForm(false)}
            industry={industry}
            subSector={subSector}
            savingsData={{
              monthlySavings,
              annualSavings,
              efficiencyIncrease,
              staffCount,
              averageWage,
              automationRate,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
