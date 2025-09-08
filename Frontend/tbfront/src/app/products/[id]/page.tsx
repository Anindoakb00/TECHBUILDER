'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import ReviewCard from "@/components/ReviewCard"

// Types
type Product = {
  id: number
  name: string
  price: number
  description: string
  images: string[]
  specs: string
}

type Review = {
  id: number
  user: string
  comment: string
  rating: number
  date?: string
}

const ProductDetailsPage = () => {
  toast('');
  const params = useParams()
  const productId = params?.id // from URL

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")

  // Fetch product + reviews (change kre nis with Django API l)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock product
        const mockProduct: Product = {
          id: Number(productId),
          name: "Laptop Pro X",
          price: 1500,
          description: "A high-performance laptop for professionals.",
          images: ["", "", ""],
          specs: "Intel i9, 32GB RAM, 1TB SSD, RTX 4080",
        }
        setProduct(mockProduct)

        // Mock reviews
        const mockReviews: Review[] = [
          { id: 1, user: "Anindo", comment: "Good", rating: 5, date: "2025-09-01" },
          { id: 2, user: "Fardin", comment: "Valo lagseeee", rating: 3, date: "2025-09-05" },
        ]
        setReviews(mockReviews)
      } catch (err) {
        toast("Failed to load product details" )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [productId, toast])

  const handleAddToCart = () => {
    toast( `${product?.name} added to cart`)
  }

  const handleBuyNow = () => {
    toast( `Proceeding to checkout for ${product?.name}` )
  }

  const handleReviewSubmit = () => {
    if (!reviewText) {
      toast( "Review cannot be empty" )
      return
    }
    const newReview: Review = {
      id: reviews.length + 1,
      user: "NSU",
      comment: reviewText,
      rating: 4,
      date: new Date().toISOString().split("T")[0],
    }
    setReviews([newReview, ...reviews])
    setReviewText("")
    toast( "Review submitted" )
  }

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id))
    toast("Review deleted" )
  }

  const handleEditReview = (id: number) => {
    toast(`Editing review #${id}` )
  
  }

  if (loading) return <p className="text-center py-10">Loading...</p>

  if (!product) return <p className="text-center py-10">Product not found</p>

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {product.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={product.name}
              width={500}
              height={400}
              className="rounded-md border"
            />
          ))}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">${product.price}</p>
          <p className="text-sm text-green-600 mb-6">In Stock</p>

          <div className="flex gap-4 mb-6">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="secondary" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>

          {/* Tabs for Description / Specs / Reviews */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p>{product.description}</p>
            </TabsContent>

            <TabsContent value="specs">
              <p>{product.specs}</p>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="flex flex-col gap-4">
                {/* Review Form */}
                <div className="border p-4 rounded-md">
                  <Textarea
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Button className="mt-2" onClick={handleReviewSubmit}>
                    Submit Review
                  </Button>
                </div>

                {/* Review List using ReviewCard */}
                {reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  reviews.map((rev) => (
                    <ReviewCard
                      key={rev.id}
                      review={rev}
                      onDelete={handleDeleteReview}
                      onEdit={handleEditReview}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="p-4 text-center">
              <Image
                src=""
                alt="Related product"
                width={200}
                height={150}
                className="mx-auto mb-4 rounded-md"
              />
              <p className="font-medium">Related Product {id}</p>
              <p className="text-gray-600">$199</p>
              <Button className="mt-2 w-full">Add to Cart</Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailsPage
