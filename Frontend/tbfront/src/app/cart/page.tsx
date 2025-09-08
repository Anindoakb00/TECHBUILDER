'use client'

import { useCartStore } from "@/app/store/cartStore"
import { Button } from "@/components/ui/button"
import CartItem from "@/components/CartItem"
import Link from "next/link"

export default function CartPage() {
  const { items, total, clear } = useCartStore()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (<CartItem key={it.product.id} item={it} />))}
          </div>

          <aside className="border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (est.)</span><span>${(total*0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span><span>${(total*1.05).toFixed(2)}</span>
            </div>
            <Link href="/checkout"><Button className="w-full mb-2">Proceed to Checkout</Button></Link>
            <Button variant="outline" className="w-full" onClick={clear}>Clear Cart</Button>
          </aside>
        </div>
      )}
    </div>
  )
}
