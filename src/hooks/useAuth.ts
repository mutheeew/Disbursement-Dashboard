"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { AUTH_COOKIE_NAME, createAuthToken, decodeAuthToken } from "@/lib/jwt"
import type { Role, User } from "@/models/transaction"

export function getCurrentUser(): User | null {
  const token = Cookies.get(AUTH_COOKIE_NAME)
  if (!token) return null

  const payload = decodeAuthToken(token)
  if (!payload) return null

  return { username: payload.username, role: payload.role }
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser())
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username: string, role: Role) => {
    const token = await createAuthToken(username, role)
    Cookies.set(AUTH_COOKIE_NAME, token, { expires: 1 / 24 })
    setUser({ username, role })
  }, [])

  const logout = useCallback(() => {
    Cookies.remove(AUTH_COOKIE_NAME)
    setUser(null)
    router.push("/login")
  }, [router])

  return { user, isLoading, login, logout }
}
