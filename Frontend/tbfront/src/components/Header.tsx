'use client'

import Link from "next/link"
import { useAuthStore } from "@/app/store/authStore"
import AuthModal from "./AuthModel"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Header() {
  const user = useAuthStore(s=>s.user)
  const logout = useAuthStore(s=>s.logout)
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto h-16 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">TechBuilders</Link>
        <div className="flex-1" />
        <div className="hidden md:block w-80"><Input placeholder="Search products..." /></div>
        <nav className="flex items-center gap-4">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          {user ? (
            <>
              <Link href="/profile">Hi, {user.name || "User"}</Link>
              <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button size="sm" onClick={()=>setOpen(true)}>Login</Button>
          )}
        </nav>
      </div>
      <AuthModal open={open} onOpenChange={setOpen} />
    </header>
  )
}
