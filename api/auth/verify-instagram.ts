import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Missing username', exists: false });
  }

  const clean = username.replace(/^@/, '').trim();

  // Basic format check
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(clean)) {
    return res.status(200).json({ exists: false, reason: 'Invalid format' });
  }

  try {
    // Check if Instagram profile exists by fetching the profile page
    const response = await fetch(`https://www.instagram.com/${clean}/`, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    });

    // Instagram returns 200 for existing profiles, 404 for non-existing
    if (response.ok) {
      return res.status(200).json({ exists: true, username: clean });
    } else {
      return res.status(200).json({ exists: false, reason: 'Profile not found' });
    }
  } catch (error) {
    // If Instagram blocks us, fall back to accepting valid format
    console.error('Instagram verification error:', error);
    return res.status(200).json({ exists: true, username: clean, fallback: true });
  }
}
