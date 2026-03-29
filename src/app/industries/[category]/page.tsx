import { notFound } from 'next/navigation';
import data from '../../../data/industry_data.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  params: {
    category: string;
  };
}

// Helper function to get category from industry name
function getCategoryFromIndustry(industry: string): string {
  const categoryMap: Record<string, string> = {
    'Catering & Food Service': 'Hospitality',
    'Construction & Trades': 'Construction',
    'Agriculture': 'Agriculture',
    'Service': 'Service'
  };
  return categoryMap[industry] || 'Other';
}

// Helper function to find all sub-niches for a category
function findSubNichesByCategory(category: string) {
  const subNiches = data.filter(item => {
    const itemCategory = getCategoryFromIndustry(item.industry);
    return itemCategory.toLowerCase() === category.toLowerCase();
  });
  return subNiches;
}

// Generate static params for category pages
export async function generateStaticParams() {
  // Get unique categories from industry data
  const industries = Array.from(new Set(data.map((item) => item.industry)));
  const categories = Array.from(new Set(industries.map(getCategoryFromIndustry)));
  
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));
}

export default function IndustryCategoryPage({ params }: Props) {
  const { category } = params;
  const subNiches = findSubNichesByCategory(category);
  
  if (subNiches.length === 0) {
    notFound();
  }
  
  // Get the category name in title case
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 text-left">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="text-gray-400">/</span>
          <a href="/industries" className="hover:text-primary transition-colors">Industries</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{categoryTitle}</span>
        </nav>
      </div>
      
      {/* Page Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <div className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          Industry Guide • 2026
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          2026 Complete Guide to AI Cost Reduction for {categoryTitle} Industry
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
          Discover how to use AI technology to reduce operational costs, improve efficiency, and ensure long-term business survival in the {categoryTitle} industry
        </p>
      </div>
      
      {/* Sub-Niches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {subNiches.map((item) => {
          const industrySlug = item.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const subNicheSlug = item.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const roiPercentage = item.roi_model.match(/\d+/)?.[0] || '30';
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{item.sub_sector}</CardTitle>
                <p className="text-sm text-gray-600">{item.industry}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  {item.pain_portrait.substring(0, 100)}...
                </p>
                <div className="flex items-center mb-4">
                  <div className="text-green-600 font-medium mr-2">💰</div>
                  <p className="text-sm sm:text-base text-gray-700">
                    Estimated Savings: {roiPercentage}%
                  </p>
                </div>
                <a 
                  href={`/${industrySlug}/${subNicheSlug}`}
                  className="block w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    View AI ROI Analysis for {item.sub_sector}
                  </Button>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Back to Home */}
      <div className="mt-12 text-center">
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
