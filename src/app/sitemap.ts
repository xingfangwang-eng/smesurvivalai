import type { MetadataRoute } from 'next';
import data from '../data/industry_data.json';

// Helper function to get category from industry name
function getCategoryFromIndustry(industry: string): string {
  const categoryMap: Record<string, string> = {
    'Catering & Food Service': 'Hospitality',
    'Construction & Trades': 'Construction',
    'Agriculture': 'Agriculture',
    'Service': 'Service',
    'Extended - Care': 'Healthcare',
    'Extended - Retail': 'Retail'
  };
  return categoryMap[industry] || 'Other';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://smesurvivalai.wangdadi.xyz';
  const today = new Date().toISOString();
  
  // Get unique industries and categories
  const uniqueIndustries = Array.from(new Set(data.map((item) => item.industry)));
  const categories = Array.from(new Set(uniqueIndustries.map(getCategoryFromIndustry)));
  
  // Generate industry pages
  const industryPages = data.map((item) => {
    const industrySlug = item.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const subNicheSlug = item.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    return {
      url: `${baseUrl}/${industrySlug}/${subNicheSlug}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });
  
  // Generate category pages
  const categoryPages = categories.map((category) => {
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    return {
      url: `${baseUrl}/industries/${categorySlug}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    };
  });
  
  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...categoryPages,
    ...industryPages,
  ];
}