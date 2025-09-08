// Replace mocks with real API calls to Django when ready
export async function getFeaturedProducts() {
  return [
    { id: 1, name: "Laptop Pro", price: 1200, image: "", category:"Laptops", brand:"Dell" },
    { id: 2, name: "Wireless Headphones", price: 200, image: "", category:"Accessories", brand:"Sony" },
    { id: 3, name: "Smartwatch", price: 150, image: "", category:"Gadgets", brand:"Apple" },
  ]
}

export async function getAllProducts() {
  return [
    { id: 1, name: "Laptop Pro", price: 1200, image: "", category:"Laptops", brand:"Dell" },
    { id: 2, name: "Wireless Headphones", price: 200, image: "", category:"Accessories", brand:"Sony" },
    { id: 3, name: "Smartwatch", price: 150, image: "", category:"Gadgets", brand:"Apple" },
    { id: 4, name: "Gaming Mouse", price: 50, image: "", category:"Accessories", brand:"Logitech" },
  ]
}

export async function getProductById(id:number) {
  const data = await getAllProducts()
  const prod = data.find(p=>p.id===id)
  if (!prod) throw new Error("Not found")
  return {
    ...prod,
    description: "High-performance device for work and play.",
    images: [prod.image, "", ""],
    specs: "Intel i9, 32GB RAM, 1TB SSD, RTX 4080"
  }
}
