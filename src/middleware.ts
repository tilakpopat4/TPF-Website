import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      // Secure admin credentials
      if (user === 'tpfadmin' && pwd === 'productionhouse') {
        return NextResponse.next()
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
  matcher: '/admin/:path*',
}
