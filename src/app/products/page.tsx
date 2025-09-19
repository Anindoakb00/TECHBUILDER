 'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'


type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand: string
  categorySlug?: string
}

const ProductListingPage = () => {
  toast("");
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string>("default")

  const searchParams = useSearchParams()
  const router = useRouter()

  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://techbuilders-backend.onrender.com/api/products/");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        console.debug('Fetched products count:', data.length);

        function slugify(s: string) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        function inferCategorySlug(name: string, categoryFromApi: string) {
          const apiSlug = slugify(categoryFromApi || '')
          if (apiSlug) return apiSlug
          const lower = (name || '').toLowerCase()
          const mapping: Record<string,string[]> = {
            laptops: ['laptop','macbook','notebook','dell','lenovo','asus','acer','hp'],
            gadgets: ['tablet','watch','smartwatch','charger','headphone','headphones','monitor','speaker','ssd','camera'],
            accessories: ['case','cover','charger','cable','adapter','mouse','keyboard','protector'],
            tools: ['tool','screwdriver','wrench','drill']
          }
          for (const [slug, kws] of Object.entries(mapping)) {
            for (const kw of kws) if (lower.includes(kw)) return slug
          }
          return ''
        }
        const products: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? item.images[0].image : (item.image || "/file.svg"),
          category: item.category_name || item.category || "",
          categorySlug: inferCategorySlug(item.name, item.category_name || item.category || ""),
          brand: item.brand_name || item.brand || "",
        }));

        try {
          products.forEach(p => console.debug('product mapped:', { id: p.id, name: p.name, category: p.category, categorySlug: p.categorySlug, imageRaw: p.image, imageNormalized: normalizeImageUrl(p.image) }));
        } catch(e) { console.error('Product debug log failed', e) }
        setProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        toast("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  
  useEffect(() => {
    let result = [...products]

    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase()
      result = result.filter((p) => (p as any).categorySlug === catLower)
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    if (sortOption === "price_low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price_high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "newest") {
      result.sort((a, b) => b.id - a.id) 
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, selectedBrand, sortOption])

  useEffect(() => {
    const cat = searchParams.get('category')
    setSelectedCategory(cat ? cat : null)
  }, [searchParams])

  const add = useCartStore(s=>s.add)

  return (
    <div className="container mx-auto py-10 flex gap-10">
      
      <aside className="w-1/4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          {["Laptops", "Gadgets", "Accessories"].map((cat) => (
            <label key={cat} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={selectedCategory?.toLowerCase() === cat.toLowerCase()}
                onCheckedChange={() => {
                  const newCat = selectedCategory?.toLowerCase() === cat.toLowerCase() ? null : cat
                  setSelectedCategory(newCat)
                  if (newCat) router.push(`/products?category=${encodeURIComponent(newCat.toLowerCase())}`)
                  else router.push('/products')
                }}
              />
              {cat}
            </label>
          ))}
        </div>

        
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

      
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>

          
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

        
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition">
                <CardContent className="flex flex-col items-center p-4">
                  <div
                    className="mb-4 w-full h-40 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <img
                      src={normalizeImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { const t = e.currentTarget as HTMLImageElement; console.error('List product image failed:', t.src); t.src = '/file.svg' }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-700">${product.price}</p>
                  <Button className="mt-4 w-full" onClick={(e) => { e.stopPropagation(); add(product,1); toast(`${product.name} added to cart`) }}>Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        
        <div className="flex justify-center mt-10">
          <Button variant="outline">Load More</Button>
        </div>
      </main>
    </div>
  )
}

export default ProductListingPage
