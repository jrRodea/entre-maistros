import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StarRating from "@/components/reviews/StarRating"
import type { WorkerProfile } from "@/types"

interface WorkerCardProps {
  worker: WorkerProfile
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const avgRating = worker.avg_rating ?? 0
  const reviewCount = worker.review_count ?? 0

  return (
    <Link href={`/trabajador/${worker.slug}`}>
      <Card className="h-full hover:shadow-md hover:border-amber-200 transition-all group">
        <CardContent className="p-4 flex gap-4">
          <div className="flex-shrink-0">
            {worker.avatar_url ? (
              <Image
                src={worker.avatar_url}
                alt={worker.name}
                width={72}
                height={72}
                className="rounded-full object-cover w-[72px] h-[72px]"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-600">
                {worker.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors truncate">
              {worker.name}
            </h3>

            <div className="flex items-center gap-1 mt-0.5">
              <StarRating rating={Math.round(avgRating)} size="sm" />
              <span className="text-xs text-gray-500 ml-1">
                {avgRating > 0 ? avgRating.toFixed(1) : 'Sin reseñas'}
                {reviewCount > 0 && ` (${reviewCount})`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {worker.categories?.slice(0, 2).map(cat => (
                <Badge key={cat.id} variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  {cat.icon} {cat.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {worker.location}
              </span>
              {worker.experience_years > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {worker.experience_years} {worker.experience_years === 1 ? 'año' : 'años'}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
