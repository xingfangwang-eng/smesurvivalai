import { Inter } from 'next/font/google';
import '../styles/globals.css';
import data from '../data/industry_data.json';

const inter = Inter({ subsets: ['latin'] });

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

// Helper function to calculate potential savings from ROI model
function calculateSavings(roiModel: string): number {
  const monthlyMatch = roiModel.match(/\$(\d+,?\d+)\/mo/);
  const oneTimeMatch = roiModel.match(/\$(\d+,?\d+)/);
  
  if (monthlyMatch) {
    return parseInt(monthlyMatch[1].replace(',', '')) * 12;
  } else if (oneTimeMatch) {
    return parseInt(oneTimeMatch[1].replace(',', ''));
  }
  return 0;
}

// Get top 5 industries with highest potential savings
const topIndustries = [...data]
  .map(item => ({
    ...item,
    savings: calculateSavings(item.roi_model)
  }))
  .sort((a, b) => b.savings - a.savings)
  .slice(0, 5);

// Get unique categories
const industries = Array.from(new Set(data.map((item) => item.industry)));
const categories = Array.from(new Set(industries.map(getCategoryFromIndustry)));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search HTML Verification Tag */}
        <meta name="google-site-verification" content="uTT2vLHXrvh44esSpln_EMc1QEFjkN0vjJZ04UgI0Qc" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WC4677QJMF"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // 动态注入项目名
            gtag('config', 'G-WC4677QJMF', {
              'project_name': 'src'
            });
          `
        }} />
      </head>
      <body className={inter.className}>
        <header className="bg-primary text-white py-4 px-6 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-center items-center">
            <h1 className="text-2xl font-bold">SME Survival AI</h1>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-primary text-white py-8 px-6 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">SME Survival AI</h3>
                <p className="text-gray-400">Empowering small businesses with AI solutions for survival and growth.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">Support: 457239850@qq.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Top AI Cost Reduction Industries</h3>
                <ul className="space-y-2 text-gray-400">
                  {topIndustries.map((item, index) => {
                    const industrySlug = item.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const subNicheSlug = item.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <li key={item.id}>
                        <a 
                          href={`/${industrySlug}/${subNicheSlug}`}
                          className="hover:text-white transition-colors"
                        >
                          {index + 1}. {item.sub_sector}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Industry Category Navigation</h3>
                <ul className="space-y-2 text-gray-400">
                  {categories.map((category) => {
                    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <li key={category}>
                        <a 
                          href={`/industries/${categorySlug}`}
                          className="hover:text-white transition-colors"
                        >
                          {category}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>© 2026 SME Survival AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Global resource loading error monitoring
            window.addEventListener('error', function(e) {
              if (e.target instanceof HTMLElement) {
                if (e.target.tagName === 'IMG') {
                  console.error('Image loading failed:', e.target.src, e.error);
                } else if (e.target.tagName === 'SCRIPT') {
                  console.error('Script loading failed:', e.target.src, e.error);
                } else if (e.target.tagName === 'LINK') {
                  console.error('Style sheet loading failed:', e.target.href, e.error);
                }
              }
            }, true);
          `
        }} />
      </body>
    </html>
  );
}
