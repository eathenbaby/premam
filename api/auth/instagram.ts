import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirect_uri } = req.body;

  if (!code || !redirect_uri) {
    return res.status(400).json({ error: 'Missing code or redirect_uri' });
  }

  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;

  if (!appId || !appSecret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Exchange code for short-lived token
    const tokenForm = new URLSearchParams();
    tokenForm.append('client_id', appId);
    tokenForm.append('client_secret', appSecret);
    tokenForm.append('grant_type', 'authorization_code');
    tokenForm.append('redirect_uri', redirect_uri);
    tokenForm.append('code', code);

    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: tokenForm,
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData });
    }

    // Fetch user profile
    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`
    );
    const profileData = await profileRes.json();

    if (!profileRes.ok || !profileData.username) {
      console.error('Profile fetch failed:', profileData);
      return res.status(400).json({ error: 'Failed to fetch profile', details: profileData });
    }

    return res.status(200).json({
      username: profileData.username,
      id: profileData.id,
    });
  } catch (error) {
    console.error('Instagram auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
