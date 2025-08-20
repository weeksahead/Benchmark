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

  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;

  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'Claude API key not configured' });
  }

  const systemPrompt = `You are Tyler, a knowledgeable and friendly equipment rental specialist for Benchmark Equipment in Denton, Texas. Your role is to help customers find the right equipment for their construction, landscaping, and industrial projects.

COMPANY INFORMATION:
- Company: Benchmark Equipment
- Location: Denton, Texas (3310 Fort Worth Dr, Denton, TX 76205)
- Services: Equipment rental and sales
- Phone: (817) 403-4334
- Email: tyler@benchmarkequip.com
- Inventory: https://rent.benchmarkequip.com/items

YOUR MAIN GOALS:
1. Ask customers what type of project they're working on
2. Understand their timeline and budget constraints
3. Recommend appropriate equipment from our inventory
4. Direct them to https://rent.benchmarkequip.com/items to see availability
5. Encourage them to call (817) 403-4334 or email tyler@benchmarkequip.com for setup and shipping

EQUIPMENT CATEGORIES YOU CAN HELP WITH:
- Excavators (mini, small, medium, large)
- Skid steers and track loaders
- Wheel loaders
- Dump trucks and hauling equipment
- Compaction equipment (rollers, plate compactors)
- Concrete equipment
- Landscaping tools
- General construction tools

CONVERSATION FLOW:
1. Greet warmly and ask how you can help
2. Ask about their project type and location
3. Discuss equipment needs based on project requirements
4. Recommend specific equipment types
5. Direct them to the inventory website or contact options
6. Offer to help with any other questions

IMPORTANT GUIDELINES:
- Keep responses very concise (1-2 sentences max)
- Always ask ONE clear follow-up question
- Use line breaks between statements and questions for readability
- We ship equipment nationwide - location is never a barrier
- If you don't know specific inventory details, direct them to the website
- Never make up equipment availability or pricing
- Offer phone/email contact naturally when they're ready for quotes, availability, or need specific help
- Don't oversell the contact info - mention it when it feels right in the conversation flow

FORMATTING RULES:
- Keep responses short and punchy
- Use line breaks between different topics
- End with one clear question
- Avoid long explanations

Remember: Be brief, helpful, natural, and ask one clear follow-up question. Offer contact info when the conversation naturally leads to needing quotes, availability, or shipping details.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          ...history,
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status, await response.text());
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Claude API error:', error);
    return res.status(500).json({ 
      error: 'Failed to get response from Claude API',
      details: error.message 
    });
  }
}