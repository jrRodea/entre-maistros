import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import StarRating from "@/components/reviews/StarRating"
import type { Review } from "@/types"

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews.length) {
    return (
      <p className="text-gray-500 text-sm py-4">
        Aún no hay reseñas. ¡Sé el primero en dejar una!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="border border-gray-100 rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-sm">{review.reviewer_name}</p>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <time className="text-xs text-gray-400 flex-shrink-0">
              {formatDistanceToNow(new Date(review.created_at), { locale: es, addSuffix: true })}
            </time>
          </div>
          {review.comment && (
            <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
