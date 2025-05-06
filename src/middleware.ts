import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = await getToken({ req: request });
    const isAuth = !!token;
    const isAuthPage = request.nextUrl.pathname.startsWith('/giris') ||
                      request.nextUrl.pathname.startsWith('/kayit');

    // Giriş yapmış kullanıcı auth sayfalarına erişmeye çalışırsa ana sayfaya yönlendir
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Giriş yapmamış kullanıcı korumalı sayfalara erişmeye çalışırsa giriş sayfasına yönlendir
    if (!isAuth && !isAuthPage) {
      let from = request.nextUrl.pathname;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/giris?from=${encodeURIComponent(from)}`, request.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Bu her zaman true döner çünkü yetkilendirmeyi yukarıda kendimiz yapıyoruz
    },
  }
);

// Hangi sayfalarda middleware'in çalışacağını belirtiyoruz
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profil/:path*',
    '/randevular/:path*',
    '/giris',
    '/kayit'
  ],
}; 