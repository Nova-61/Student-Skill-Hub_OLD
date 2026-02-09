import { useState } from "react"
import { api } from "../api"

interface ReviewFormProps {
  taskId: number
  onSuccess?: () => void
}

interface Review {
  id: number
  rating: number
  comment: string
  reviewer: string
  created_at: string
}

export default function ReviewForm({ taskId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Пожалуйста, выберите оценку")
      return
    }

    setLoading(true)
    setError("")

    try {
      await api.post("reviews/create/", {
        task_id: taskId,
        rating,
        comment,
      })

      setSuccess("Отзыв успешно оставлен!")
      setRating(0)
      setComment("")
      setShowForm(false)

      // Reload reviews
      loadReviews()
      onSuccess?.()
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка при сохранении отзыва")
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const res = await api.get(`reviews/task/${taskId}/`)
      setReviews(res.data)
    } catch (err) {
      console.error("Ошибка при загрузке отзывов:", err)
    }
  }

  const getRatingStars = (count: number) => {
    return "★".repeat(count) + "☆".repeat(5 - count)
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      try {
        await api.delete(`reviews/${reviewId}/`)
        loadReviews()
      } catch (err) {
        setError("Ошибка при удалении отзыва")
      }
    }
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-bold mb-4">Отзывы о выполнении</h3>

      {/* Review Form */}
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true)
            loadReviews()
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          + Оставить отзыв
        </button>
      ) : (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded">
          {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-3 p-2 bg-green-50 text-green-700 rounded">{success}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Оценка (1-5 звезд)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-sm text-gray-600 mt-1">{rating} из 5 звезд</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ваш отзыв
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Поделитесь своим мнением об исполнителе..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Оставить отзыв"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-600 py-4">Нет отзывов</p>
        ) : (
          <>
            <h4 className="font-semibold text-gray-700">Все отзывы ({reviews.length})</h4>
            {reviews.map((review) => (
              <div key={review.id} className="border-t pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.reviewer}</p>
                    <p className="text-yellow-500 text-lg">{getRatingStars(review.rating)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Удалить
                  </button>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString("ru-RU")}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
