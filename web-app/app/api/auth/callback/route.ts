import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect('/?error=missing_code');
  }

  const domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;

  // Exchange code for tokens
  const tokenResponse = await fetch(`${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect('/?error=token_exchange_failed');
  }
  const tokenData = await tokenResponse.json();

  // Decode ID token for user info
  const idToken = tokenData.id_token;
  let user = null;
  if (idToken) {
    user = jwt.decode(idToken);
  }

  // Set cookie with user info (for demo; use secure session in production)
  const response = NextResponse.redirect('/');
  if (user) {
    response.cookies.set('auth_user', JSON.stringify(user), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
  }
  return response;
}
