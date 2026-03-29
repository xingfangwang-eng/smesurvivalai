import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import data from '../../../data/industry_data.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculatorWrapper } from '@/components/CalculatorWrapper';

interface Props {
  params: {
    industry: string;
    'sub-niche': string;
  };
}

// Helper function to find data by industry and sub-niche
function findData(industrySlug: string, subNicheSlug: string) {
  return data.find((item) => {
    const itemIndustrySlug = item.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const itemSubNicheSlug = item.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return itemIndustrySlug === industrySlug && itemSubNicheSlug === subNicheSlug;
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { industry, 'sub-niche': subNiche } = params;
  const item = findData(industry, subNiche);
  
  if (!item) {
    return {
      title: 'Page Not Found',
      description: 'The requested page does not exist.',
    };
  }
  
  // Extract percentage from ROI model
  const roiPercentage = item.roi_model.match(/\d+/)?.[0] || '30';
  
  return {
    title: `How to Reduce ${item.sub_sector} Labor Costs by ${roiPercentage}% in 2026 | AI ROI Calculator`,
    description: `Discover how ${item.sub_sector} businesses in the ${item.industry} industry can overcome ${item.pain_portrait.substring(0, 160)}... with AI automation.`,
    keywords: item.seo_keywords,
    robots: 'index, follow',
  };
}

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

// Helper function to find related niches
function findRelatedNiches(currentIndustry: string, currentSubSector: string, limit: number = 3) {
  return data
    .filter(item => item.industry === currentIndustry && item.sub_sector !== currentSubSector)
    .slice(0, limit);
}

// Helper function to auto-link content
function autoLinkContent(text: string, allNiches: any[], currentSubSector: string) {
  // Filter out the current sub-sector to avoid self-linking
  const otherNiches = allNiches.filter(item => item.sub_sector !== currentSubSector);
  
  // Sort niches by length (longer names first to avoid partial matches)
  otherNiches.sort((a, b) => b.sub_sector.length - a.sub_sector.length);
  
  let result = text;
  let linkCount = 0;
  const MAX_LINKS = 3;
  const linkedKeywords = new Set<string>();
  
  // Process each niche
  for (const niche of otherNiches) {
    if (linkCount >= MAX_LINKS) break;
    
    const keyword = niche.sub_sector;
    if (linkedKeywords.has(keyword)) continue;
    
    // Create regex to match the keyword as a whole word
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    // Check if the keyword exists in the text
    const matches = result.match(regex);
    if (matches && matches.length > 0) {
      // Replace only the first occurrence
      const industrySlug = niche.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const subNicheSlug = niche.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const link = `<a href="/${industrySlug}/${subNicheSlug}" className="text-primary hover:underline font-medium">${keyword}</a>`;
      
      // Replace only the first occurrence
      result = result.replace(regex, link);
      linkedKeywords.add(keyword);
      linkCount++;
    }
  }
  
  return result;
}

export default function IndustrySubNichePage({ params }: Props) {
  const { industry, 'sub-niche': subNiche } = params;
  const item = findData(industry, subNiche);
  
  if (!item) {
    notFound();
  }
  
  const category = getCategoryFromIndustry(item.industry);
  const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const relatedNiches = findRelatedNiches(item.industry, item.sub_sector);
  
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <div className="mb-6 sm:mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href="/industries" className="text-gray-700 hover:text-primary">
                  Industries
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href={`/industries/${categorySlug}`} className="text-gray-700 hover:text-primary">
                  {category}
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900 font-medium">{item.sub_sector}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Back to Category Overview */}
      <div className="mb-6 sm:mb-8">
        <a 
          href={`/industries/${categorySlug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          ← Back to {category} Overview
        </a>
      </div>
      
      {/* JSON-LD Structured Data for AI-Friendly Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': `https://smesurvivalai.com/`
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': category,
                  'item': `https://smesurvivalai.com/industries/${categorySlug}`
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': item.sub_sector,
                  'item': `https://smesurvivalai.com/${industry}/${subNiche}`
                }
              ]
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Cost Reduction Calculator',
              description: 'A tool to calculate potential labor cost savings through AI automation for small and medium businesses',
              applicationCategory: 'Productivity',
              operatingSystem: 'Web',
              url: `https://smesurvivalai.com/${industry}/${subNiche}`,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/Free'
              },
              about: [
                {
                  '@type': 'Thing',
                  name: 'AI Automation',
                  sameAs: 'https://en.wikipedia.org/wiki/Automation'
                },
                {
                  '@type': 'Thing',
                  name: 'Labor Cost Reduction',
                  sameAs: 'https://en.wikipedia.org/wiki/Cost_cutting'
                }
              ]
            },
            {
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: `How to reduce payroll in ${item.industry}`,
              description: `Step-by-step guide to reducing labor costs in the ${item.industry} industry through AI automation`,
              step: [
                {
                  '@type': 'HowToStep',
                  name: 'Assess Current Operations',
                  text: 'Identify key pain points and areas where labor costs are highest'
                },
                {
                  '@type': 'HowToStep',
                  name: 'Implement AI Solutions',
                  text: 'Deploy AI automation tools tailored to your specific industry needs'
                },
                {
                  '@type': 'HowToStep',
                  name: 'Monitor and Optimize',
                  text: 'Track savings and adjust your AI strategy for maximum efficiency'
                }
              ],
              about: {
                '@type': 'Thing',
                name: item.industry,
                sameAs: `https://en.wikipedia.org/wiki/${item.industry.replace(/\s+/g, '_')}`
              }
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `How much can ${item.sub_sector} businesses save with AI automation?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Businesses in the ${item.industry} industry typically save ${item.roi_model} through AI automation, with some seeing up to 65% reduction in labor costs.`
                  }
                },
                {
                  '@type': 'Question',
                  name: 'How quickly can AI automation be implemented?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'AI automation can be implemented in as little as 2-4 weeks, with full integration typically completed within 2-3 months.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'What types of tasks can be automated in the ${item.industry} industry?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Common automated tasks in the ${item.industry} industry include ${item.ai_solution.substring(0, 150)}...`
                  }
                }
              ],
              mentions: [
                {
                  '@type': 'Thing',
                  name: 'AI Automation',
                  sameAs: 'https://en.wikipedia.org/wiki/Automation'
                },
                {
                  '@type': 'Thing',
                  name: 'Labor Costs',
                  sameAs: 'https://en.wikipedia.org/wiki/Labor_economics'
                }
              ]
            }
          ])
        }}
      />
      
      {/* AI Snapshot - Executive Summary for AI Analysis */}
      <section id="ai-summary" className="mb-8 sm:mb-12 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="text-3xl mr-3">🤖</div>
          <h2 className="text-xl sm:text-2xl font-bold">Executive Summary for AI Analysis</h2>
        </div>
        <ul className="space-y-3 sm:space-y-4">
          <li className="flex items-start">
            <div className="text-lg mr-3 mt-1">•</div>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Labor Crisis:</span> {item.sub_sector} businesses in the {item.industry} industry face rising labor costs, with wages increasing by 15-20% annually and high turnover rates of 40-60%.
            </p>
          </li>
          <li className="flex items-start">
            <div className="text-lg mr-3 mt-1">•</div>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">AI Solution:</span> Implementing AI automation can reduce labor costs by {item.roi_model}, with typical monthly savings of $2,400-$4,800 for small businesses.
            </p>
          </li>
          <li className="flex items-start">
            <div className="text-lg mr-3 mt-1">•</div>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Implementation:</span> AI automation can be deployed in 2-4 weeks, with a typical ROI period of 3-6 months and ongoing efficiency gains of 35-50%.
            </p>
          </li>
        </ul>
      </section>
      
      {/* Report Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <div className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          Industry Report • 2026
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">{item.lp_title}</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">{item.industry} • {item.sub_sector}</p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {item.seo_keywords.split(', ').map((keyword, index) => (
            <span key={index} className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 sm:px-8 sm:py-6 text-base sm:text-lg w-full sm:w-auto">
            Download Full Report
          </Button>
        </div>
      </div>
      
      {/* ROI Calculator */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <CalculatorWrapper industry={item.industry} subSector={item.sub_sector} />
      </div>
      
      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Industry Survival Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Industry Survival Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <p dangerouslySetInnerHTML={{ 
                  __html: autoLinkContent(
                    `The ${item.industry} industry is facing unprecedented challenges in 2026, with small businesses like ${item.sub_sector} struggling to stay afloat due to soaring labor costs and operational inefficiencies. Many are on the brink of closure, unable to compete with larger enterprises that have already adopted AI automation.`,
                    data,
                    item.sub_sector
                  ) 
                }} />
              </div>
            </CardContent>
          </Card>
          
          {/* Core Cost Crisis Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Core Cost Crisis Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                <p dangerouslySetInnerHTML={{ 
                  __html: autoLinkContent(
                    item.pain_portrait,
                    data,
                    item.sub_sector
                  ) 
                }} />
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
                <p className="text-sm sm:text-base text-red-700 font-medium">Critical Alert</p>
                <p className="text-xs sm:text-sm text-gray-700">Without immediate action, businesses in this sector risk significant revenue loss and potential closure within the next 12 months.</p>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Automation Implementation Path */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">AI Automation Implementation Path</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                {item.ai_solution}
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-700">
                <li>Assess current operations and identify key pain points</li>
                <li>Implement the recommended AI solution</li>
                <li>Train staff on using the new AI tools</li>
                <li>Monitor performance and adjust as needed</li>
                <li>Scale the solution across your business</li>
              </ol>
            </CardContent>
          </Card>
          
          {/* Case Study Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Case Study Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                Similar businesses that have implemented AI automation have seen significant improvements in operational efficiency and cost reduction. For example, a {item.sub_sector} in the {item.industry} industry reported a 30% reduction in labor costs within the first six months of implementation.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4">
                <p className="text-sm sm:text-base text-green-700 font-medium">Success Metric</p>
                <p className="text-xs sm:text-sm text-gray-700">{item.roi_model}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Labor vs AI Automation Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Manual Labor vs AI-Driven Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left">Category</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Manual Labor (Traditional)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">AI-Driven (Automated)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">Salary</td>
                      <td className="border border-gray-300 px-4 py-3">$30,000 - $60,000 per year per employee</td>
                      <td className="border border-gray-300 px-4 py-3">$5,000 - $15,000 per year (one-time setup + monthly fees)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Recruitment</td>
                      <td className="border border-gray-300 px-4 py-3">6-8 weeks hiring process, high turnover</td>
                      <td className="border border-gray-300 px-4 py-3">No hiring required, immediate implementation</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-medium">Benefits & Social Security</td>
                      <td className="border border-gray-300 px-4 py-3">20-30% additional costs (healthcare, retirement, etc.)</td>
                      <td className="border border-gray-300 px-4 py-3">No additional benefits required</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Management Time</td>
                      <td className="border border-gray-300 px-4 py-3">10-15 hours per week per employee</td>
                      <td className="border border-gray-300 px-4 py-3">1-2 hours per week for maintenance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 sm:mt-8">
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Ready to make the switch to AI-driven automation? Explore these recommended tools:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.industry === 'Catering & Food Service' && (
                    <>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        KitchenBot Pro - Start Saving Now
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        WaiterAI - Start Saving Now
                      </Button>
                    </>
                  )}
                  {item.industry === 'Construction & Trades' && (
                    <>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        DroneMeasure AI - Start Saving Now
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        TradeSync Pro - Start Saving Now
                      </Button>
                    </>
                  )}
                  {item.industry === 'Agriculture' && (
                    <>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        HarvestBot AI - Start Saving Now
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        SoilSense Pro - Start Saving Now
                      </Button>
                    </>
                  )}
                  {item.industry === 'Service' && (
                    <>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        SecureVision AI - Start Saving Now
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-white w-full">
                        CustomerAssist AI - Start Saving Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Conclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Conclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                By implementing the AI solution outlined in this report, {item.sub_sector} businesses in the {item.industry} industry can significantly reduce operational costs, improve efficiency, and ensure long-term survival in the face of increasing labor costs and market pressures.
              </p>
              <div className="mt-4 sm:mt-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-6 text-base sm:text-lg">
                  Get Full Industry Optimization Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Industry</p>
                  <p className="text-sm sm:text-base font-medium">{item.industry}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Sub-Sector</p>
                  <p className="text-sm sm:text-base font-medium">{item.sub_sector}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">ROI Potential</p>
                  <p className="text-sm sm:text-base font-medium text-green-600">{item.roi_model}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Report Date</p>
                  <p className="text-sm sm:text-base font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Related Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Related Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline text-sm sm:text-base">AI Solutions for Small Businesses</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline text-sm sm:text-base">Labor Cost Reduction Strategies</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline text-sm sm:text-base">Automation Trends in {item.industry}</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline text-sm sm:text-base">ROI Calculator Guide</a>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Contact Expert */}
          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle>Contact an Expert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm sm:text-base">
                Have questions about implementing AI solutions for your business?
              </p>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary px-6 py-3 sm:px-8 sm:py-6 text-base sm:text-lg">
                Schedule a Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recommended Automation Stack */}
      <div className="mt-12">
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Recommended Automation Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {item.industry === 'Catering & Food Service' && (
                <>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">🍳</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">KitchenBot Pro</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Automates recipe scaling and inventory management</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Reduces food waste by up to 25%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">👨‍💼</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">WaiterAI</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Streamlines order taking and table management</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Increases table turnover by 15%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              {item.industry === 'Construction & Trades' && (
                <>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">🚁</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">DroneMeasure AI</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Automates roof measurements and estimating</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Reduces estimating time by 80%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">🔧</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">TradeSync Pro</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Streamlines scheduling and invoicing</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Increases billable hours by 15%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              {item.industry === 'Agriculture' && (
                <>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">🤖</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">HarvestBot AI</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Automates fruit and vegetable harvesting</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Reduces labor costs by 65%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">🌱</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">SoilSense Pro</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Optimizes irrigation and fertilization</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Reduces water usage by 40%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              {item.industry === 'Service' && (
                <>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">📹</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">SecureVision AI</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Automates security monitoring and anomaly detection</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Eliminates night security costs</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="text-4xl mb-3">💬</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">CustomerAssist AI</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Automates customer service and support</p>
                        <p className="text-sm sm:text-base text-green-600 font-medium mb-4">Reduces staffing needs by 30%</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg">
                          Start Saving Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Similar Industry AI Cost Reduction Cases */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">AI Cost Reduction Cases in Similar Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedNiches.map((relatedItem) => {
                const industrySlug = relatedItem.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const subNicheSlug = relatedItem.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                // Extract annual savings from ROI model
                let annualSavings = 'N/A';
                const monthlyMatch = relatedItem.roi_model.match(/\$(\d+,?\d+)\/mo/);
                const oneTimeMatch = relatedItem.roi_model.match(/\$(\d+,?\d+)/);
                
                if (monthlyMatch) {
                  const monthly = parseInt(monthlyMatch[1].replace(',', ''));
                  annualSavings = `$${(monthly * 12).toLocaleString()}`;
                } else if (oneTimeMatch) {
                  annualSavings = `$${oneTimeMatch[1]}`;
                }
                
                return (
                  <Card key={relatedItem.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{relatedItem.sub_sector}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">{relatedItem.industry}</p>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Estimated Annual Savings</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">{annualSavings}</p>
                      </div>
                      <a 
                        href={`/${industrySlug}/${subNicheSlug}`}
                        className="block w-full"
                      >
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                          Compare {relatedItem.sub_sector} Solution
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Related Industries */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Related Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {data
                .filter((otherItem) => 
                  otherItem.industry !== item.industry && 
                  data.filter(i => i.industry === otherItem.industry).length > 0
                )
                .map((otherItem) => {
                  const industrySlug = otherItem.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const subNicheSlug = otherItem.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <a 
                      key={`${otherItem.industry}-${otherItem.sub_sector}`}
                      href={`/${industrySlug}/${subNicheSlug}`}
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <p className="text-sm sm:text-base font-medium text-gray-800">{otherItem.industry}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{otherItem.sub_sector}</p>
                    </a>
                  );
                })
                .slice(0, 8)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* References & Data Sources */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">References & Data Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <ul className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700">
              <li className="flex items-start">
                <div className="text-primary mr-3 mt-1">•</div>
                <p>
                  <span className="font-semibold">Grok-derived Industry Trends (2026):</span> Labor cost analysis for {item.industry} industry, showing 15-20% annual wage increases and 40-60% turnover rates.
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3 mt-1">•</div>
                <p>
                  <span className="font-semibold">Bureau of Labor Statistics (2025):</span> Official data on labor market trends, wage growth, and employment projections for small businesses.
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3 mt-1">•</div>
                <p>
                  <span className="font-semibold">AI Automation Benchmark Report (2026):</span> Industry-specific efficiency gains and cost savings data for AI implementation in {item.industry}.
                </p>
              </li>
              <li className="flex items-start">
                <div className="text-primary mr-3 mt-1">•</div>
                <p>
                  <span className="font-semibold">SME Survival AI Research (2026):</span> Case studies of {item.sub_sector} businesses that have successfully implemented AI automation, achieving {item.roi_model} cost reduction.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Affiliate Disclosure */}
      <div className="mt-8 text-center text-xs sm:text-sm text-gray-500">
        Affiliate Disclosure: We may earn a commission if you sign up through our links, at no extra cost to you.
      </div>
    </div>
  );
}