import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const state = Math.random().toString(36).substring(7);
  
  const loginUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.AUTH0_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.AUTH0_BASE_URL + '/auth/callback')}&` +
    `scope=${encodeURIComponent('openid profile email')}&` +
    `state=${state}`;
  
  return NextResponse.redirect(loginUrl);
}