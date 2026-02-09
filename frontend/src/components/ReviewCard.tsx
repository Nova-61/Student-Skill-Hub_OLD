interface ReviewCardProps {
  reviewer: string
  rating: number
  comment: string
}

export default function ReviewCard({ reviewer, rating, comment }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm text-gray-900">{reviewer}</span>
        <span className="text-yellow-500">{'★'.repeat(rating)}</span>
      </div>
      <p className="text-gray-600 text-xs leading-relaxed">{comment}</p>
    </div>
  )
}
