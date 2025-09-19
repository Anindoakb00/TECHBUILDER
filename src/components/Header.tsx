
'use client'

import Link from "next/link"
import { useAuthStore } from "@/app/store/authStore"
import AuthModal from "./AuthModel"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [open, setOpen] = useState(false)

 
  const categories = [
    { title: "Laptops", slug: "laptops" },
    { title: "Tools", slug: "tools" },
    { title: "Gadgets", slug: "gadgets" },
    { title: "Accessories", slug: "accessories" },
  ]

  return (
    <header className="border-b bg-gray-900 text-white">
      <div className="container mx-auto h-16 flex items-center gap-6">
      
        <Link href="/" className="font-bold text-xl">TechBuilders</Link>

        
        <div className="hidden md:block flex-1">
          <Input placeholder="Search products..." className="bg-gray-800 border-none text-white" />
        </div>

        
        <nav className="flex items-center gap-6">
          <Link href="/products" className="hover:text-blue-400">Products</Link>

     
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border border-gray-700">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild>
                  <Link href={`/products?category=${cat.slug}`} className="w-full hover:text-blue-400">
                    {cat.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/cart" className="hover:text-blue-400">Cart</Link>

          {user ? (
            <>
              <Link href="/profile" className="hover:text-blue-400">
                Hi, {user.name || "User"}
              </Link>
              <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setOpen(true)}>Login</Button>
          )}
        </nav>
      </div>
      <AuthModal open={open} onOpenChange={setOpen} />
    </header>
  )
}
