"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { LogOut } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold text-primary">Disbursement Dashboard</h1>
          <p className="text-xs text-muted-foreground">Mini dashboard transaksi disbursement</p>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
            </div>
            <Avatar className="size-8 bg-primary/10">
              <AvatarFallback className="text-primary">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
