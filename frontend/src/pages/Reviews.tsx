import { useEffect, useState } from "react"
import { api } from "../api"
import Navbar from "../components/Navbar"
import ReviewCard from "../components/ReviewCard"

interface Review {
  id: number
  reviewer: string
  rating: number
  comment: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    api.get("reviews/").then((res) => setReviews(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Reviews</h1>
        {reviews.map((r) => (
          <ReviewCard key={r.id} reviewer={r.reviewer} rating={r.rating} comment={r.comment} />
        ))}
      </div>
    </div>
  )
}
