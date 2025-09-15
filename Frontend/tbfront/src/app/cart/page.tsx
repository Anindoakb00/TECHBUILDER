'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CartPage() {
 
  const items = [
    {
      id: 1,
      name: "Laptop Pro X",
      price: 1499,
      qty: 1,
      image: "/images/laptop.jpg",
      details: '16" Display, 16GB RAM, 512GB SSD',
    },
    {
      id: 2,
      name: "Wireless Noise-Cancelling Headphones",
      price: 349,
      qty: 1,
      image: "/images/headphones.jpg",
      details: "Matte Black",
    },
  ]

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const shipping = 0
  const taxes = +(subtotal * 0.08).toFixed(2) // 8% tax mock
  const total = subtotal + shipping + taxes

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
  
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Your Cart</h1>
          <p className="mt-2 text-lg text-gray-600">
            You have {items.length} item{items.length > 1 && "s"} in your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-sm"
              >
               
                <div className="w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>

               
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                    </div>
                    <button
                      aria-label="Remove item"
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                        -
                      </button>
                      <span className="font-medium text-base w-8 text-center">
                        {item.qty}
                      </span>
                      <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-lg text-slate-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        
          <aside className="bg-white p-8 rounded-lg shadow-sm sticky top-28 h-fit">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-base text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Taxes</span>
                <span className="font-medium text-gray-900">${taxes.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="flex justify-between text-xl font-bold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Promo Code */}
            <div className="mt-8">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="promo-code"
              >
                Have a promo code?
              </label>
              <div className="flex mt-2">
                <input
                  id="promo-code"
                  placeholder="Enter code"
                  className="form-input flex-1 rounded-l-md border-gray-300 focus:border-slate-500 focus:ring-slate-500"
                />
                <button className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-r-md hover:bg-gray-300 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <Button className="w-full mt-8 h-12 text-base font-bold">
              Proceed to Checkout
            </Button>
          </aside>
        </div>
      </div>
    </main>
  )
}
