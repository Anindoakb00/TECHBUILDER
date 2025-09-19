'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ProductCard from "@/components/ProductCard"
import { getFeaturedProducts } from "@/lib/products"
import { normalizeImageUrl } from '@/lib/images'

export default function Page() {
  toast('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await getFeaturedProducts()
        setProducts(data)

        const jbl = data.find((it:any) => (it.name || '').toLowerCase().includes('jbl screen protector'))
        const chosen = jbl || (data.length > 0 ? data[0] : null)
        setHeroImage(chosen ? normalizeImageUrl(chosen.image) : null)
      } catch (e) {
        console.error(e)
        toast("Failed to load featured products")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="flex flex-col gap-12">

      <section className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">Build the future with the right tech</h1>
            <p className="text-lg text-slate-200 max-w-lg">High-quality devices, great prices, and fast shipping. Discover curated picks and daily deals.</p>
            <div className="flex items-center gap-4">
              <Link href="/products"><Button size="lg">Shop All Products</Button></Link>
              <Link href="/products"><Button variant="ghost">Explore Deals</Button></Link>
            </div>
            <div className="flex gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">Free</div>
                <div className="text-sm text-slate-300">Shipping over $50</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">30d</div>
                <div className="text-sm text-slate-300">Easy returns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-slate-300">Support</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/5 rounded-2xl p-6 shadow-xl">
              <div className="w-full h-96 rounded-xl overflow-hidden bg-gray-200">

                <img src={heroImage || '/file.svg'} alt="hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Link href="/products" className="text-sm text-slate-600">See all products →</Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No featured products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>


      <section className="bg-gradient-to-r from-slate-50 to-white py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">Limited time offer</h3>
          <p className="text-slate-600">Sign up and get exclusive early access to our weekly deals.</p>
        </div>
      </section>
    </div>
  )
}
