const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 测试链接列表
const linksToTest = [
  // API 端点
  'http://localhost:3000/api/leads',
  
  // 页面链接
  'http://localhost:3000/',
  'http://localhost:3000/industries/hospitality',
  'http://localhost:3000/construction-trades/independent-hvac-repair-service',
  
  // 外部链接
  'https://schema.org',
  'https://en.wikipedia.org/wiki/Automation',
  'https://en.wikipedia.org/wiki/Cost_cutting'
];

// 测试函数
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

// 运行测试
testLinks();
