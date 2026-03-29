const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Test links list
const linksToTest = [
  // API endpoints
  'http://localhost:3000/api/leads',
  
  // Page links
  'http://localhost:3000/',
  'http://localhost:3000/industries/hospitality',
  'http://localhost:3000/construction-trades/independent-hvac-repair-service',
  
  // External links
  'https://schema.org',
  'https://en.wikipedia.org/wiki/Automation',
  'https://en.wikipedia.org/wiki/Cost_cutting'
];

// Test function
async function testLinks() {
  console.log('Testing links...');
  
  for (const link of linksToTest) {
    try {
      const response = await fetch(link);
      console.log(`${link} - ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${link} - ERROR: ${error.message}`);
    }
  }
  
  console.log('Link testing completed!');
}

// Run tests
testLinks();
