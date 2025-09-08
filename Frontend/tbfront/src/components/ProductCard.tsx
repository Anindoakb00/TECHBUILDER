'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCartStore } from "@/app/store/cartStore"

export default function ProductCard({ product }: { product: any }) {
  const add = useCartStore(s=>s.add)
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="flex flex-col items-center p-4">
        <Link href={`/products/${product.id}`} className="w-full">
          <Image src={product.image} alt={product.name} width={320} height={220} className="mb-4 rounded-md w-full h-auto"/>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </Link>
        <p className="text-gray-700">${product.price}</p>
        <Button className="mt-4 w-full" onClick={()=>add(product,1)}>Add to Cart</Button>
      </CardContent>
    </Card>
  )
}
