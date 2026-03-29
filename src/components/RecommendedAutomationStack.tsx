'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import recommendationsData from '@/data/recommendations.json';

interface RecommendedAutomationStackProps {
  industry: string;
  annualSavings: number;
  showHighlight: boolean;
}

export function RecommendedAutomationStack({ industry, annualSavings, showHighlight }: RecommendedAutomationStackProps) {
  // Find recommendations for current industry
  const getIndustryRecommendations = () => {
    const industryData = recommendationsData.recommendations.find(
      (rec) => rec.industry.toLowerCase() === industry.toLowerCase()
    );
    return industryData?.tools.slice(0, 2) || [];
  };

  return (
    <>
      {/* Recommended Automation Stack */}
      <div className={`mt-12 ${showHighlight ? 'animate-pulse' : ''}`}>
        <Card className={`border-2 ${showHighlight ? 'border-primary' : 'border-gray-200'}`}>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Recommended Automation Stack</CardTitle>
            {showHighlight && (
              <p className="text-primary font-medium text-base sm:text-lg">
                Use these tools to achieve your ${annualSavings.toLocaleString()} savings.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {getIndustryRecommendations().map((tool, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="text-4xl mb-3">{tool.icon}</div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{tool.name}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">{tool.efficiency}</p>
                      <p className="text-sm sm:text-base text-green-600 font-medium mb-4">{tool.saving}</p>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                        Start Saving Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Affiliate Disclosure */}
      <div className="mt-8 text-center text-xs sm:text-sm text-gray-500">
        Affiliate Disclosure: We may earn a commission if you sign up through our links, at no extra cost to you.
      </div>
    </>
  );
}