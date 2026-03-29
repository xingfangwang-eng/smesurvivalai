import type { MetadataRoute } from 'next';
import data from '../data/industry_data.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://smesurvivalai.com';
  const today = new Date().toISOString();
  
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
  
  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...industryPages,
  ];
}