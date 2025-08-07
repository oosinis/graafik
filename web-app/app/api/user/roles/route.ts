// app/api/user/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get user ID from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
    
    // Debug: Check if env vars are present (don't log the actual values)
    console.log('Environment check:', {
      domain: domain ? 'Present' : 'Missing',
      clientId: clientId ? 'Present' : 'Missing', 
      clientSecret: clientSecret ? 'Present' : 'Missing'
    });
    
    if (!domain || !clientId || !clientSecret) {
      throw new Error('Missing required environment variables');
    }
    
    // Get Management API token
    const tokenPayload = {
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials'
    };
    
    console.log('Token request payload:', {
      client_id: clientId,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials'
      // Don't log client_secret
    });
    
    const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenPayload)
    });
    
    console.log('Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token response error:', errorText);
      throw new Error(`Failed to get management token: ${tokenResponse.status} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Token received successfully');
    
    // Fetch user roles
    const rolesUrl = `https://${domain}/api/v2/users/${encodeURIComponent(userId)}/roles`;
    console.log('Fetching roles from:', rolesUrl);
    
    const rolesResponse = await fetch(rolesUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Roles response status:', rolesResponse.status);
    
    if (!rolesResponse.ok) {
      const errorText = await rolesResponse.text();
      console.error('Roles response error:', errorText);
      throw new Error(`Failed to fetch roles: ${rolesResponse.status} - ${errorText}`);
    }
    
    const rolesData = await rolesResponse.json();
    console.log('Roles data:', rolesData);
    
    // Extract role names
    const roles = rolesData.map((role: any) => role.name);
    console.log('Extracted role names:', roles);
    
    return NextResponse.json({ roles });
    
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch roles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}