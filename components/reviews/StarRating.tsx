'use client'

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ rating, max = 5, interactive, onChange, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(i + 1) : undefined}
          className={cn('transition-transform', interactive && 'cursor-pointer hover:scale-110')}
          disabled={!interactive}
        >
          <Star
            className={cn(
              sizeClass,
              i < rating
                ? 'fill-brand-amarillo text-brand-amarillo'
                : 'fill-brand-crema-300 text-brand-crema-300'
            )}
          />
        </button>
      ))}
    </div>
  )
}
