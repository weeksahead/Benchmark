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

  const { type, data, password } = req.body;

  // Simple password check (you should use environment variable in production)
  if (password !== 'benchmark2024') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GitHub API configuration
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const GITHUB_OWNER = 'weeksahead';
  const GITHUB_REPO = 'Benchmark';
  const GITHUB_BRANCH = 'main';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    let path, content, message;
    
    if (type === 'slides') {
      path = 'src/config/slides.json';
      content = JSON.stringify(data, null, 2);
      message = 'Update hero slider configuration';
    } else if (type === 'photos') {
      path = 'src/config/photos.json';
      content = JSON.stringify(data, null, 2);
      message = 'Update photo gallery configuration';
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // Get current file SHA
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    let sha;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    // Update or create file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          content: Buffer.from(content).toString('base64'),
          branch: GITHUB_BRANCH,
          sha: sha, // Include SHA if updating existing file
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error('GitHub API error:', error);
      return res.status(500).json({ error: 'Failed to update GitHub' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Changes saved successfully! They will be live in 1-2 minutes.' 
    });

  } catch (error) {
    console.error('Error saving to GitHub:', error);
    return res.status(500).json({ error: 'Failed to save changes' });
  }
}