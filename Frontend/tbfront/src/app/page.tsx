'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {toast } from "sonner"
import ProductCard from "@/components/ProductCard"
import { getFeaturedProducts } from "@/lib/products"

export default function Page() {
   toast('');
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await getFeaturedProducts()
        setProducts(data)
      } catch {
        toast("Failed to load featured products" )
      } finally {
        setLoading(false)
      }
    })()
  }, [toast])

  return (
    <div className="flex flex-col gap-12">
      <section className="w-full h-[420px] bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TechBuilders</h1>
          <p className="text-lg mb-6">Your one-stop shop for tech products</p>
          <Link href="/products"><Button>Shop Now</Button></Link>
        </div>
      </section>

     

      <section className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </section>

      <section className="bg-blue-100 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Deals of the Day</h2>
        <p className="mb-6">Get up to 50% off on selected gadgets!</p>
        <Link href="/products"><Button variant="secondary">Browse Deals</Button></Link>
      </section>
    </div>
  )
}
