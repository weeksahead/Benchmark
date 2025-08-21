export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    console.log('Scraping Machine Trader for:', query);
    
    // Try to scrape real Machine Trader data first
    const scrapedResults = await scrapeRealMachineTrader(query);
    
    if (scrapedResults && scrapedResults.length > 0) {
      return res.status(200).json({
        success: true,
        query: query,
        machines: scrapedResults,
        count: scrapedResults.length,
        source: 'Live Machine Trader data'
      });
    } else {
      // Fallback to mock data if scraping fails
      const mockResults = generateMockResults(query);
      
      return res.status(200).json({
        success: true,
        query: query,
        machines: mockResults,
        count: mockResults.length,
        note: 'Sample data - Machine Trader scraping temporarily unavailable'
      });
    }

  } catch (error) {
    console.error('Machine search error:', error);
    
    // Return mock data as fallback
    const mockResults = generateMockResults(query);
    
    return res.status(200).json({
      success: true,
      query: query,
      machines: mockResults,
      count: mockResults.length,
      note: 'Sample data - using fallback due to scraping error'
    });
  }
}

async function scrapeRealMachineTrader(query) {
  let browser = null;
  
  try {
    // Import Puppeteer dynamically (since it's a serverless function)
    const puppeteer = await import('puppeteer');
    
    console.log('Launching browser for Machine Trader scraping...');
    
    // Launch browser with optimized settings for Vercel
    browser = await puppeteer.default.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to Industrial Machine Trader search
    const searchUrl = `https://www.industrialmachinetrader.com/listings/search?keywords=${encodeURIComponent(query)}`;
    console.log('Navigating to:', searchUrl);
    
    await page.goto(searchUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for search results to load
    await page.waitForTimeout(3000);
    
    // Extract machine listings using browser JavaScript
    const machines = await page.evaluate(() => {
      const listings = [];
      
      // Look for common listing selectors on Machine Trader
      const listingElements = document.querySelectorAll('[class*="listing"], [class*="result"], [class*="item"], .search-result');
      
      listingElements.forEach((element, index) => {
        if (index >= 10) return; // Limit to 10 results
        
        try {
          // Extract title
          const titleEl = element.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"]');
          const title = titleEl?.textContent?.trim();
          
          // Extract price
          const priceEl = element.querySelector('[class*="price"], [class*="cost"]');
          const priceText = priceEl?.textContent?.trim();
          const price = priceText?.match(/\$[\d,]+/)?.[0];
          
          // Extract year
          const yearMatch = element.textContent.match(/\b(19[7-9]\d|20[0-2]\d)\b/);
          const year = yearMatch?.[0];
          
          // Extract hours
          const hoursMatch = element.textContent.match(/(\d{1,3}(?:,\d{3})*)\s*(?:hrs?|hours?)/i);
          const hours = hoursMatch ? `${hoursMatch[1]} hrs` : null;
          
          // Extract location
          const locationMatch = element.textContent.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/);
          const location = locationMatch ? `${locationMatch[1]}, ${locationMatch[2]}` : null;
          
          // Extract link
          const linkEl = element.querySelector('a[href]');
          const relativeUrl = linkEl?.getAttribute('href');
          const url = relativeUrl ? (relativeUrl.startsWith('http') ? relativeUrl : `https://www.industrialmachinetrader.com${relativeUrl}`) : null;
          
          if (title && title.length > 10) {
            listings.push({
              title: title,
              price: price,
              year: year,
              hours: hours,
              location: location || 'Location not specified',
              url: url || `https://www.industrialmachinetrader.com/listings/search?keywords=${encodeURIComponent(title)}`,
              description: `Used equipment for sale - ${title}`
            });
          }
        } catch (err) {
          console.log('Error processing listing:', err);
        }
      });
      
      return listings;
    });
    
    console.log(`Successfully scraped ${machines.length} machines from Machine Trader`);
    return machines;
    
  } catch (error) {
    console.error('Error with Puppeteer scraping:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function parseRealMachineTraderHTML(html) {
  const machines = [];
  
  try {
    // Look for listing containers - Machine Trader uses various patterns
    // Try multiple selectors that commonly contain equipment listings
    
    // Extract titles - look for common patterns in equipment listings
    const titleRegex = /<h[2-4][^>]*>([^<]*(?:excavator|loader|dozer|roller|compactor|skid|steer|tractor|truck|crane)[^<]*)<\/h[2-4]>/gi;
    const titles = [...html.matchAll(titleRegex)].map(match => match[1].trim());
    
    // Extract prices - look for dollar amounts
    const priceRegex = /\$[\d,]+(?:\.\d{2})?/g;
    const prices = [...html.matchAll(priceRegex)].map(match => match[0]);
    
    // Extract years - 4 digit years between 1970-2025
    const yearRegex = /\b(19[7-9]\d|20[0-2]\d)\b/g;
    const years = [...html.matchAll(yearRegex)].map(match => match[0]);
    
    // Extract hours - pattern like "1,234 hrs" or "1234 hours"
    const hoursRegex = /(\d{1,3}(?:,\d{3})*)\s*(?:hrs?|hours?)/gi;
    const hours = [...html.matchAll(hoursRegex)].map(match => `${match[1]} hrs`);
    
    // Extract locations - City, ST format
    const locationRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/g;
    const locations = [...html.matchAll(locationRegex)].map(match => `${match[1]}, ${match[2]}`);
    
    // Extract listing URLs - look for equipment listing links
    const urlRegex = /href="([^"]*(?:listing|equipment|machine)[^"]*\d+[^"]*)"/gi;
    const urls = [...html.matchAll(urlRegex)].map(match => {
      const url = match[1];
      return url.startsWith('http') ? url : `https://www.industrialmachinetrader.com${url}`;
    });
    
    // Combine the extracted data
    const maxItems = Math.min(titles.length, 10); // Limit to 10 results
    
    for (let i = 0; i < maxItems; i++) {
      if (titles[i] && titles[i].length > 10) { // Ensure we have a real title
        const machine = {
          title: titles[i].replace(/\s+/g, ' ').trim(),
          price: prices[i] || null,
          year: years[i] || null,
          hours: hours[i] || null,
          location: locations[i] || 'Location not specified',
          url: `https://www.industrialmachinetrader.com/listings/search?keywords=${encodeURIComponent(query)}`,
          description: `Used ${titles[i].toLowerCase().includes('excavator') ? 'excavator' : 
                                titles[i].toLowerCase().includes('loader') ? 'loader' :
                                titles[i].toLowerCase().includes('skid') ? 'skid steer' : 'equipment'} for sale`
        };
        
        machines.push(machine);
      }
    }
    
  } catch (error) {
    console.error('Error parsing Machine Trader HTML:', error);
  }
  
  return machines;
}

function parseMachineTraderResults(html) {
  // This is a simplified parser - in production you'd want a more robust HTML parser
  const machines = [];
  
  try {
    // Look for common patterns in Machine Trader listing pages
    // This is a basic regex-based approach for demonstration
    
    // Extract listing titles (common pattern for equipment listings)
    const titleMatches = html.match(/<h[3-6][^>]*>([^<]*(?:excavator|skid|loader|dozer|roller|truck|tractor)[^<]*)<\/h[3-6]>/gi) || [];
    
    // Extract prices (look for dollar amounts)
    const priceMatches = html.match(/\$[\d,]+/g) || [];
    
    // Extract years (4-digit years between 1990-2025)
    const yearMatches = html.match(/\b(19[9]\d|20[0-2]\d)\b/g) || [];
    
    // Extract locations (common location patterns)
    const locationMatches = html.match(/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/g) || [];
    
    // Combine the extracted data into machine objects
    for (let i = 0; i < Math.min(titleMatches.length, 10); i++) {
      const machine = {
        title: titleMatches[i].replace(/<[^>]*>/g, '').trim(),
        price: priceMatches[i] || null,
        year: yearMatches[i] || null,
        location: locationMatches[i] || null,
        url: 'https://www.machinetrader.com', // Would extract actual URLs in production
      };
      
      machines.push(machine);
    }
    
  } catch (parseError) {
    console.error('Error parsing Machine Trader results:', parseError);
  }
  
  return machines;
}

function generateMockResults(query) {
  // Generate realistic mock data based on the search query
  const mockMachines = [];
  
  // Determine machine type from query
  const isExcavator = /excavator/i.test(query);
  const isSkidSteer = /skid|bobcat/i.test(query);
  const isLoader = /loader/i.test(query);
  const isDozer = /dozer|bulldozer/i.test(query);
  const isRoller = /roller|compactor|dynapac/i.test(query);
  const isCaterpillar = /cat|caterpillar/i.test(query);
  
  if (isExcavator) {
    mockMachines.push(
      {
        title: "2019 Caterpillar 320 Hydraulic Excavator",
        price: "$125,000",
        year: "2019",
        hours: "3,200",
        location: "Dallas, TX",
        description: "Excellent condition, recent service, ready to work",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=caterpillar%20320%20excavator"
      },
      {
        title: "2020 Komatsu PC210LC-11 Excavator",
        price: "$135,000",
        year: "2020",
        hours: "2,800",
        location: "Houston, TX",
        description: "Low hours, one owner, full maintenance records",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=komatsu%20excavator"
      },
      {
        title: "2018 John Deere 350G LC Excavator",
        price: "$110,000",
        year: "2018",
        hours: "4,100",
        location: "Austin, TX",
        description: "Well maintained, new tracks, hydraulic system serviced",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=john%20deere%20excavator"
      }
    );
  } else if (isSkidSteer) {
    mockMachines.push(
      {
        title: "2021 Bobcat S650 Skid Steer Loader",
        price: "$42,000",
        year: "2021",
        hours: "1,200",
        location: "Denton, TX",
        description: "Like new condition, low hours, includes bucket",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=bobcat%20skid%20steer"
      },
      {
        title: "2020 Caterpillar 262D3 Skid Steer",
        price: "$45,000",
        year: "2020",
        hours: "1,800",
        location: "Fort Worth, TX",
        description: "Excellent condition, high flow hydraulics",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=caterpillar%20skid%20steer"
      },
      {
        title: "2019 Case SV340 Skid Steer",
        price: "$38,000",
        year: "2019",
        hours: "2,100",
        location: "Plano, TX",
        description: "Well maintained, new tires, ready to work",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=case%20skid%20steer"
      }
    );
  } else if (isRoller) {
    mockMachines.push(
      {
        title: "2020 Dynapac CA2500D Soil Compactor",
        price: "$85,000",
        year: "2020",
        hours: "1,500",
        location: "Arlington, TX",
        description: "Low hours, excellent condition, recent service",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=dynapac%20compactor"
      },
      {
        title: "2019 Caterpillar CS44B Vibratory Roller",
        price: "$78,000",
        year: "2019",
        hours: "2,200",
        location: "Irving, TX",
        description: "Well maintained, smooth drum, ready for work",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=caterpillar%20roller"
      }
    );
  } else if (isLoader) {
    mockMachines.push(
      {
        title: "2021 Caterpillar 950M Wheel Loader",
        price: "$185,000",
        year: "2021",
        hours: "1,800",
        location: "Dallas, TX",
        description: "Low hours, excellent condition, includes bucket",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=caterpillar%20wheel%20loader"
      },
      {
        title: "2020 John Deere 544L Wheel Loader",
        price: "$165,000",
        year: "2020",
        hours: "2,400",
        location: "Garland, TX",
        description: "Well maintained, new tires, hydraulic system serviced",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=john%20deere%20wheel%20loader"
      }
    );
  } else {
    // Generic results for other searches - always provide some results
    const baseResults = [
      {
        title: "2020 Caterpillar 320 Hydraulic Excavator",
        price: "$128,000",
        year: "2020",
        hours: "2,800",
        location: "Dallas, TX",
        description: "Excellent condition, well maintained, ready to work",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=caterpillar%20excavator"
      },
      {
        title: "2021 Bobcat S650 Skid Steer Loader", 
        price: "$43,500",
        year: "2021",
        hours: "1,200",
        location: "Fort Worth, TX",
        description: "Low hours, like new condition, includes standard bucket",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=bobcat%20skid%20steer"
      },
      {
        title: "2019 John Deere 544L Wheel Loader",
        price: "$168,000",
        year: "2019", 
        hours: "2,100",
        location: "Houston, TX",
        description: "Well maintained, new tires, excellent hydraulics",
        url: "https://www.industrialmachinetrader.com/listings/search?keywords=john%20deere%20wheel%20loader"
      }
    ];
    
    // Filter results based on query terms or return all
    if (query.trim()) {
      const filteredResults = baseResults.filter(machine => 
        machine.title.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().split(' ').some(term => 
          machine.title.toLowerCase().includes(term)
        )
      );
      mockMachines.push(...(filteredResults.length > 0 ? filteredResults : baseResults.slice(0, 1)));
    } else {
      mockMachines.push(...baseResults);
    }
  }
  
  return mockMachines;
}