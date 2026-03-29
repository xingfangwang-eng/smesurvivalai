import Link from 'next/link';
import data from '../data/industry_data.json';

// Extract unique industries from the data
const industries = Array.from(new Set(data.map((item) => item.industry)));

// Get unique categories
function getCategoryFromIndustry(industry: string): string {
  const categoryMap: Record<string, string> = {
    'Catering & Food Service': 'Hospitality',
    'Construction & Trades': 'Construction',
    'Agriculture': 'Agriculture',
    'Service': 'Service'
  };
  return categoryMap[industry] || 'Other';
}

const categories = Array.from(new Set(industries.map(getCategoryFromIndustry)));

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">SME Survival AI</h1>
        <p className="text-xl text-gray-600">
          AI-powered solutions for small and medium enterprises to survive and thrive in 2026
        </p>
      </div>
      
      {/* Industry Categories Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Industry Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const categorySubNiches = data.filter(item => 
              getCategoryFromIndustry(item.industry) === category
            );
            
            return (
              <div key={category} className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <p className="mb-4">{categorySubNiches.length} Sub-Niches</p>
                <Link 
                  href={`/industries/${categorySlug}`} 
                  className="inline-block bg-white text-primary font-medium px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  View Complete Guide
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Industries Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {industries.map((industry) => {
          // Get sub-sectors for this industry
          const subSectors = data
            .filter((item) => item.industry === industry)
            .map((item) => item.sub_sector);
          
          return (
            <div key={industry} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-primary mb-4">{industry}</h2>
              <ul className="space-y-2">
                {subSectors.map((subSector) => {
                  // Generate slug from industry and sub-sector
                  const industrySlug = industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const subSectorSlug = subSector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  
                  return (
                    <li key={subSector}>
                      <Link 
                        href={`/${industrySlug}/${subSectorSlug}`} 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {subSector}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}