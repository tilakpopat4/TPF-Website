import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (basicAuth) {
      try {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        // Secure admin credentials (configured via env or fallback)
        const expectedUser = process.env.ADMIN_USERNAME || 'tpfadmin'
        const expectedPassword = process.env.ADMIN_PASSWORD || 'adminuser'

        if (user === expectedUser && pwd === expectedPassword) {
          return NextResponse.next()
        }
      } catch (e) {
        console.error('Basic auth parsing error:', e)
      }
    }

    // Force prompt on unauthorized
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="TPF Admin Secure Area"',
      },
    })
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
