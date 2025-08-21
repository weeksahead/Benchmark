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
    console.log('Searching for machines:', query);
    
    // Generate mock results that look like real Machine Trader data
    // This provides reliable demo functionality for machine research
    const mockResults = generateMockResults(query);
    
    return res.status(200).json({
      success: true,
      query: query,
      machines: mockResults,
      count: mockResults.length,
      note: 'Demo data - showing sample machines available for purchase'
    });

  } catch (error) {
    console.error('Machine search error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to search for machines',
      query: query
    });
  }
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
        url: "https://www.machinetrader.com/listing/2019-caterpillar-320-hydraulic-excavator"
      },
      {
        title: "2020 Komatsu PC210LC-11 Excavator",
        price: "$135,000",
        year: "2020",
        hours: "2,800",
        location: "Houston, TX",
        description: "Low hours, one owner, full maintenance records",
        url: "https://www.machinetrader.com/listing/2020-komatsu-pc210lc-11-excavator"
      },
      {
        title: "2018 John Deere 350G LC Excavator",
        price: "$110,000",
        year: "2018",
        hours: "4,100",
        location: "Austin, TX",
        description: "Well maintained, new tracks, hydraulic system serviced",
        url: "https://www.machinetrader.com/listing/2018-john-deere-350g-lc-excavator"
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
        url: "https://www.machinetrader.com/listing/2021-bobcat-s650-skid-steer"
      },
      {
        title: "2020 Caterpillar 262D3 Skid Steer",
        price: "$45,000",
        year: "2020",
        hours: "1,800",
        location: "Fort Worth, TX",
        description: "Excellent condition, high flow hydraulics",
        url: "https://www.machinetrader.com/listing/2020-caterpillar-262d3-skid-steer"
      },
      {
        title: "2019 Case SV340 Skid Steer",
        price: "$38,000",
        year: "2019",
        hours: "2,100",
        location: "Plano, TX",
        description: "Well maintained, new tires, ready to work",
        url: "https://www.machinetrader.com/listing/2019-case-sv340-skid-steer"
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
        url: "https://www.machinetrader.com/listing/2020-dynapac-ca2500d-compactor"
      },
      {
        title: "2019 Caterpillar CS44B Vibratory Roller",
        price: "$78,000",
        year: "2019",
        hours: "2,200",
        location: "Irving, TX",
        description: "Well maintained, smooth drum, ready for work",
        url: "https://www.machinetrader.com/listing/2019-caterpillar-cs44b-roller"
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
        url: "https://www.machinetrader.com/listing/2021-caterpillar-950m-wheel-loader"
      },
      {
        title: "2020 John Deere 544L Wheel Loader",
        price: "$165,000",
        year: "2020",
        hours: "2,400",
        location: "Garland, TX",
        description: "Well maintained, new tires, hydraulic system serviced",
        url: "https://www.machinetrader.com/listing/2020-john-deere-544l-wheel-loader"
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
        url: "https://www.machinetrader.com/listing/2020-caterpillar-320-excavator"
      },
      {
        title: "2021 Bobcat S650 Skid Steer Loader", 
        price: "$43,500",
        year: "2021",
        hours: "1,200",
        location: "Fort Worth, TX",
        description: "Low hours, like new condition, includes standard bucket",
        url: "https://www.machinetrader.com/listing/2021-bobcat-s650-skid-steer"
      },
      {
        title: "2019 John Deere 544L Wheel Loader",
        price: "$168,000",
        year: "2019", 
        hours: "2,100",
        location: "Houston, TX",
        description: "Well maintained, new tires, excellent hydraulics",
        url: "https://www.machinetrader.com/listing/2019-john-deere-544l-wheel-loader"
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