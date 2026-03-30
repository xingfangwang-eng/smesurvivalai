import data from '../../data/industry_data.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

// Get unique industries and categories
export default function IndustriesPage() {
  // Get unique industries
  const uniqueIndustries = Array.from(new Set(data.map((item) => item.industry)));
  
  // Get unique categories
  const categories = Array.from(new Set(uniqueIndustries.map(getCategoryFromIndustry)));
  
  // Group industries by category
  const industriesByCategory: Record<string, string[]> = {};
  categories.forEach(category => {
    industriesByCategory[category] = uniqueIndustries.filter(industry => 
      getCategoryFromIndustry(industry) === category
    );
  });

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 text-left">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Industries</span>
        </nav>
      </div>
      
      {/* Page Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <div className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          Industry Guide • 2026
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          AI Cost Reduction Solutions by Industry
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
          Explore how AI technology can help reduce costs and improve efficiency across different industries
        </p>
      </div>
      
      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((category) => {
          const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const industryCount = industriesByCategory[category].length;
          
          return (
            <Card key={category} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <a 
                  href={`/industries/${categorySlug}`}
                  className="block hover:no-underline"
                >
                  <CardTitle className="text-lg sm:text-xl hover:text-primary transition-colors">{category}</CardTitle>
                </a>
                <p className="text-sm text-gray-600">{industryCount} industries</p>
              </CardHeader>
              <CardContent>
                <a 
                  href={`/industries/${categorySlug}`}
                  className="block w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Explore {category} Solutions
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