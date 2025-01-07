import { NextResponse } from 'next/server';

import { auth } from './auth';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from './route';

export const middleware = auth(async (req) => {
  const secretKey = process.env.AUTH_SECRET;

  if (!secretKey) {
    throw new Error('AUTH_SECRET is not defined');
  }

  const token = req.auth;

  const { nextUrl } = req;
  const isLoggedIn = !!token;

  // Route checks
  const isApiAuthRoute =
    nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(
    nextUrl.pathname
  );
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith('/blogs') ||
    nextUrl.pathname.startsWith(
      '/tobacco-business'
    ) ||
    nextUrl.pathname.startsWith(
      '/news-updates'
    ) ||
    nextUrl.pathname.startsWith('/resources') ||
    nextUrl.pathname.startsWith('/contact') ||
    nextUrl.pathname.startsWith(
      '/social-media'
    ) ||
    nextUrl.pathname.startsWith('/posts') ||
    nextUrl.pathname.startsWith(
      '/set-password'
    ) ||
    nextUrl.pathname.startsWith(
      '/reset-password'
    ) ||
    nextUrl.pathname.startsWith(
      '/forgot-password'
    ) ||
    nextUrl.pathname.startsWith('/api') ||
    nextUrl.pathname.startsWith('/about');

  // Skip API auth routes
  if (isApiAuthRoute) return;

  // Allow public access to the login page without redirecting if not logged in
  if (
    (nextUrl.pathname === '/login' ||
      nextUrl.pathname === '/register') &&
    !isLoggedIn
  )
    return;

  // Redirect logged-in users away from login and register pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL('/', nextUrl)
    );
  }

  // Redirect to login if not logged in and accessing a protected route
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(
      new URL('/login', nextUrl)
    );
  }

  // Role-based redirection if logged in and accessing the wrong route
  if (isLoggedIn && token) {
    switch (token?.role) {
      case 'USER':
        if (
          !nextUrl.pathname.startsWith('/user')
        ) {
          return NextResponse.redirect(
            new URL('/user', nextUrl)
          );
        }
        break;

      case 'ADMIN':
      case 'MANAGER':
        if (
          !nextUrl.pathname.startsWith('/admin')
        ) {
          return NextResponse.redirect(
            new URL('/admin', nextUrl)
          );
        }
        break;

      default:
        if (
          nextUrl.pathname !==
          DEFAULT_LOGIN_REDIRECT
        ) {
          return NextResponse.redirect(
            new URL('/', nextUrl)
          );
        }
    }
  }

  // No redirect needed
  return;
});

// Configure the middleware to match specific routes
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
