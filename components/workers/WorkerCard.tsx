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
      <Card className="h-full bg-white border border-brand-crema-300 rounded-2xl hover:shadow-lg hover:border-brand-naranja/30 transition-all group">
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
              <div className="w-[72px] h-[72px] rounded-full bg-brand-verde-100 flex items-center justify-center text-2xl font-display font-bold text-brand-verde">
                {worker.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-brand-verde group-hover:text-brand-naranja transition-colors truncate">
              {worker.name}
            </h3>

            <div className="flex items-center gap-1 mt-0.5">
              <StarRating rating={Math.round(avgRating)} size="sm" />
              <span className="text-xs font-sans text-brand-verde-600 ml-1">
                {avgRating > 0 ? avgRating.toFixed(1) : 'Sin reseñas'}
                {reviewCount > 0 && ` (${reviewCount})`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {worker.categories?.slice(0, 2).map(cat => (
                <Badge
                  key={cat.id}
                  className="bg-brand-verde-100 text-brand-verde-700 rounded-full px-3 py-0.5 text-xs font-sans font-medium border-0"
                >
                  {cat.icon} {cat.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs font-sans text-brand-verde-600">
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
