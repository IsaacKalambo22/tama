import { NextResponse } from "next/server"

import { auth } from "./auth"
const publicRoutes = [
  "/",
  "/services",
  "/social-media",
  "/blogs",
  "/contact",
  "/who-we-are",
]

export const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"]
export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"

export const adminRoutes = "/admin"
export const councilAdminRoutes = "/council-admin"
export const districtAdminRoutes = "/district-admin"
export const farmerRoutes = "/farmer"

const roleRouteMap: Record<string, string> = {
  SUPER_ADMIN: adminRoutes,
  COUNCIL_ADMIN: councilAdminRoutes,
  DISTRICT_ADMIN: districtAdminRoutes,
  FARMER: farmerRoutes,
}

const isRoleAllowedOnRoute = (role: string, pathname: string): boolean => {
  if (role === "SUPER_ADMIN") {
    return (
      pathname.startsWith(adminRoutes) ||
      pathname.startsWith(councilAdminRoutes) ||
      pathname.startsWith(districtAdminRoutes) ||
      pathname.startsWith(farmerRoutes)
    )
  }
  if (role === "COUNCIL_ADMIN") {
    return (
      pathname.startsWith(councilAdminRoutes) ||
      pathname.startsWith(districtAdminRoutes)
    )
  }
  if (role === "DISTRICT_ADMIN") {
    return pathname.startsWith(districtAdminRoutes)
  }
  if (role === "FARMER") {
    return pathname.startsWith(farmerRoutes)
  }
  return false
}

export const middleware = auth(async (req) => {
  const secretKey = process.env.AUTH_SECRET

  if (!secretKey) {
    throw new Error("AUTH_SECRET is not defined")
  }

  const token = req.auth

  const { nextUrl } = req
  const isLoggedIn = !!token

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isAuthRoute =
    authRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/set-password") ||
    nextUrl.pathname.startsWith("/reset-password")

  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutes)
  const isCouncilAdminRoute = nextUrl.pathname.startsWith(councilAdminRoutes)
  const isDistrictAdminRoute = nextUrl.pathname.startsWith(districtAdminRoutes)
  const isFarmerRoute = nextUrl.pathname.startsWith(farmerRoutes)

  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/tobacco-business") ||
    nextUrl.pathname.startsWith("/news-updates") ||
    nextUrl.pathname.startsWith("/resources") ||
    nextUrl.pathname.startsWith("/api")

  if (isApiAuthRoute) return
  if (isPublicRoute) return

  if (isAuthRoute && !isLoggedIn) return

  if (isAuthRoute && isLoggedIn) {
    const role = token?.role || "FARMER"
    const redirectTo = roleRouteMap[role] || farmerRoutes
    return NextResponse.redirect(new URL(redirectTo, nextUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  if (
    isLoggedIn &&
    token &&
    (isAdminRoute ||
      isCouncilAdminRoute ||
      isDistrictAdminRoute ||
      isFarmerRoute)
  ) {
    const role = token.role as string

    if (!isRoleAllowedOnRoute(role, nextUrl.pathname)) {
      const redirectTo = roleRouteMap[role] || farmerRoutes
      return NextResponse.redirect(new URL(redirectTo, nextUrl))
    }

    return
  }

  if (isLoggedIn && token) {
    const role = token.role as string
    const defaultRoute = roleRouteMap[role] || farmerRoutes

    if (!nextUrl.pathname.startsWith(defaultRoute)) {
      return NextResponse.redirect(new URL(defaultRoute, nextUrl))
    }
  }

  return
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
