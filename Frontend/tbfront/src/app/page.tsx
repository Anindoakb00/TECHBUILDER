'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { toast } from "sonner"


// Types
type Product = {
  id: number
  name: string
  price: number
  image: string
}

// Page Component
const Page = () => {
 
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Product ja ja ase tui add kore nis mama from Django backend 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // akhn amni dia rakhlam tui pore replace kore nis Django API 
        const mockProducts: Product[] = [
          { id: 1, name: "Laptop Pro", price: 1200, image: "" },
          { id: 2, name: "Wireless Headphones", price: 200, image: "" },
          { id: 3, name: "Smartwatch", price: 150, image: "" },
        ]
        setProducts(mockProducts)
      } catch (err) {
      toast("Failed to create account.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [toast])

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Banner */}
      <section className="w-full h-[400px] bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TechBuilders</h1>
          <p className="text-lg mb-6">Your one-stop shop for tech products</p>
          <Link href="/products">
            <Button variant="default">Shop Now</Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Laptops", "Tools", "Gadgets", "Accessories"].map((cat, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="text-center font-semibold">{cat}</CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition">
                <CardContent className="flex flex-col items-center p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="mb-4 rounded-md"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-700">${product.price}</p>
                  <Button className="mt-4 w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Promotional Section */}
      <section className="bg-blue-100 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Deals of the Day</h2>
        <p className="mb-6">Get up to 50% off on selected gadgets!</p>
        <Link href="/products">
          <Button variant="secondary">Browse Deals</Button>
        </Link>
      </section>
    </div>
  )
}

export default Page
