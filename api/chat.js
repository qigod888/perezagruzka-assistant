import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return res.status(500).json({
        error: 'GROQ_API_KEY not configured',
        hint: 'Add GROQ_API_KEY to Vercel Environment Variables (get key at console.groq.com)'
      });
    }

    const { messages, model, max_tokens, temperature } = req.body || {};

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-8b-instant',
        messages: messages || [],
        max_tokens: max_tokens || 1200,
        temperature: temperature ?? 0.4
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
