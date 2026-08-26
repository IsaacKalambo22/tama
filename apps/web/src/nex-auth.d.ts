import "next-auth"

declare module "next-auth" {
  interface User {
    accessToken?: string
    id?: string
    name?: string
    email?: string
    role?: string
    image?: string
    councilId?: string
    districtId?: string
    councilName?: string
    districtName?: string
  }

  interface Session {
    accessToken?: string
    id?: string
    name?: string
    email?: string
    role?: string
    image?: string
    councilId?: string
    districtId?: string
    councilName?: string
    districtName?: string
  }

  interface JWT {
    accessToken?: string
    id?: string
    name?: string
    email?: string
    role?: string
    image?: string
    councilId?: string
    districtId?: string
    councilName?: string
    districtName?: string
  }
}
