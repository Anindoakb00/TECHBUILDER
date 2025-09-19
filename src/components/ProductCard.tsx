"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"
import { normalizeImageUrl } from '@/lib/images'

export default function ProductCard({ product }: { product: any }) {
  const add = useCartStore(s=>s.add)
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="flex flex-col items-center p-4">
        <Link href={`/products/${product.id}`} className="w-full">
          <div className="mb-4 w-full h-40 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            <img
              src={normalizeImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                console.error('Product image failed to load, replacing with placeholder:', t.src);
                t.src = '/file.svg';
              }}
            />
          </div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </Link>
        <p className="text-gray-700">${product.price}</p>
        <Button className="mt-4 w-full" onClick={()=>add(product,1)}>Add to Cart</Button>
      </CardContent>
    </Card>
  )
}
