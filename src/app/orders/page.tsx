'use client'

import { useEffect, useState } from "react"

type Order = {
  id: number
  date: string
  total: number
  status: string
  items: { name: string; qty: number; price: number }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetch("https://techbuilders-backend.onrender.com/api/orders/")
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        
        const orders: Order[] = data.map((o: any) => ({
          id: o.id,
          date: o.date || o.created_at || "",
          total: o.total || o.amount || 0,
          status: o.status || "",
          items: o.items || [],
        }))
        setOrders(orders)
      } catch (err) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-sm text-gray-500">{order.date}</span>
                <span className="text-sm text-blue-600">{order.status}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Total: </span>${order.total}
              </div>
              <ul className="text-sm text-gray-700 list-disc ml-6">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} x{item.qty} - ${item.price}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
