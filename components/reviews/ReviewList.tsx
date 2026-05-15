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
      <p className="font-sans text-brand-verde-600 text-sm py-4">
        Aún no hay reseñas. ¡Sé el primero en dejar una!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="bg-white border border-brand-crema-300 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-sans font-semibold text-sm text-brand-verde">{review.reviewer_name}</p>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <time className="text-xs font-sans text-brand-crema-300 flex-shrink-0">
              {formatDistanceToNow(new Date(review.created_at), { locale: es, addSuffix: true })}
            </time>
          </div>
          {review.comment && (
            <p className="mt-2 text-sm font-sans text-brand-verde-600">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
