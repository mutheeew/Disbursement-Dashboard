import { SignJWT, jwtVerify, decodeJwt } from "jose"
import type { Role } from "@/models/transaction"

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
export const AUTH_COOKIE_NAME = "auth_token"
export const ONE_HOUR_SECONDS = 60 * 60

export interface AuthPayload {
  username: string
  role: Role
  exp: number
}

export async function createAuthToken(username: string, role: Role) {
  const exp = Math.floor(Date.now() / 1000) + ONE_HOUR_SECONDS

  return new SignJWT({ username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .sign(JWT_SECRET)
}

export async function verifyAuthToken(
  token: string
): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (!payload.username || !payload.role || !payload.exp) return null
    return payload as unknown as AuthPayload
  } catch {
    return null
  }
}

export function decodeAuthToken(token: string): AuthPayload | null {
  try {
    const payload = decodeJwt(token)
    if (!payload.username || !payload.role || !payload.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload as unknown as AuthPayload
  } catch {
    return null
  }
}
