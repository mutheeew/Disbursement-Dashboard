import axios from "axios"
import Cookies from "js-cookie"
import { AUTH_COOKIE_NAME } from "@/lib/jwt"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(AUTH_COOKIE_NAME)
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)
