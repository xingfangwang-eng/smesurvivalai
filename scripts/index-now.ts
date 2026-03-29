import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import industryData from '../src/data/industry_data.json';

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smesurvivalai.com';
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service-account-key.json';

// Initialize Google Indexing API
function getIndexingAPI() {
  try {
    const keyFile = readFileSync(join(process.cwd(), SERVICE_ACCOUNT_KEY_PATH), 'utf-8');
    const credentials = JSON.parse(keyFile);
    
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    
    return google.indexing({ version: 'v3', auth });
  } catch (error) {
    console.error('Error initializing Google Indexing API:', error);
    throw new Error('Failed to initialize Google Indexing API. Please check your service account key file.');
  }
}

// Generate URLs from industry data
function generateUrls(): string[] {
  const urls: string[] = [];
  
  industryData.forEach((item) => {
    // Convert industry and sub-sector to URL-friendly format
    const industrySlug = item.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const subNicheSlug = item.sub_sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const url = `${BASE_URL}/${industrySlug}/${subNicheSlug}`;
    urls.push(url);
  });
  
  return urls;
}

// Submit URL to Google Indexing API
async function submitUrl(indexing: any, url: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });
    
    return {
      success: true,
      message: `Successfully submitted: ${url}`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to submit ${url}: ${error.message || error}`
    };
  }
}

// Main function to index all URLs
async function indexAllUrls() {
  console.log('Starting Google Indexing API submission...');
  console.log(`Base URL: ${BASE_URL}`);
  
  try {
    const indexing = getIndexingAPI();
    const urls = generateUrls();
    
    console.log(`Found ${urls.length} URLs to submit.`);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Submit URLs with a delay to avoid rate limiting
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[${i + 1}/${urls.length}] Submitting: ${url}`);
      
      const result = await submitUrl(indexing, url);
      
      if (result.success) {
        successCount++;
        console.log(`✓ ${result.message}`);
      } else {
        failureCount++;
        console.error(`✗ ${result.message}`);
      }
      
      // Add delay to avoid rate limiting (Google allows ~600 requests per minute)
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total URLs: ${urls.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log(`Success Rate: ${((successCount / urls.length) * 100).toFixed(2)}%`);
    
  } catch (error) {
    console.error('Error during indexing:', error);
    process.exit(1);
  }
}

// Index a single URL
async function indexSingleUrl(url: string) {
  console.log(`Indexing single URL: ${url}`);
  
  try {
    const indexing = getIndexingAPI();
    const result = await submitUrl(indexing, url);
    
    if (result.success) {
      console.log(`✓ ${result.message}`);
    } else {
      console.error(`✗ ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during indexing:', error);
    process.exit(1);
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Index all URLs
    await indexAllUrls();
  } else if (args[0] === '--url' && args[1]) {
    // Index single URL
    await indexSingleUrl(args[1]);
  } else {
    console.log('Usage:');
    console.log('  node scripts/index-now.ts              # Index all URLs from industry data');
    console.log('  node scripts/index-now.ts --url <URL>  # Index a single URL');
    console.log('');
    console.log('Environment Variables:');
    console.log('  NEXT_PUBLIC_BASE_URL           # Your website base URL (default: https://smesurvivalai.com)');
    console.log('  GOOGLE_SERVICE_ACCOUNT_KEY_PATH # Path to your Google service account key file (default: ./service-account-key.json)');
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
