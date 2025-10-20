import { auth0 } from '@/lib/auth0'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    if (typeof auth0.logout === 'function') {
      try {
        await auth0.logout(req)
      } catch (e) {
        // ignore
      }
    }
  } catch (err) {
    // ignore
  }

  return NextResponse.redirect(new URL('/login', req.url))
}
