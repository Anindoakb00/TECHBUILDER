'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Types
type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand: string
}

const ProductListingPage = () => {
  toast("");
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string>("default")

  // Fetch products (replace kore nis pore Django theke )
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const mockProducts: Product[] = [
          { id: 1, name: "Laptop Pro", price: 1200, image: "", category: "Laptops", brand: "Dell" },
          { id: 2, name: "Wireless Headphones", price: 200, image: "", category: "Accessories", brand: "Sony" },
          { id: 3, name: "Smartwatch", price: 150, image: "", category: "Gadgets", brand: "Apple" },
          { id: 4, name: "Gaming Mouse", price: 50, image: "", category: "Accessories", brand: "Logitech" },
        ]
        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } catch (err) {
        toast("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [toast])

  // Handle filtering + sorting
  useEffect(() => {
    let result = [...products]

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    if (sortOption === "price_low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price_high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "newest") {
      result.sort((a, b) => b.id - a.id) // newest by ID
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, selectedBrand, sortOption])

  return (
    <div className="container mx-auto py-10 flex gap-10">
      {/* Sidebar Filters */}
      <aside className="w-1/4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          {["Laptops", "Gadgets", "Accessories"].map((cat) => (
            <label key={cat} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={selectedCategory === cat}
                onCheckedChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Brand</h3>
          {["Dell", "Sony", "Apple", "Logitech"].map((brand) => (
            <label key={brand} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={selectedBrand === brand}
                onCheckedChange={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>

          {/* Sorting */}
          <Select onValueChange={setSortOption} defaultValue="default">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <Button variant="outline">Load More</Button>
        </div>
      </main>
    </div>
  )
}

export default ProductListingPage
