import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import StarRating from "@/components/reviews/StarRating"
import WorkerPhotoGrid from "@/components/workers/WorkerPhotoGrid"
import type { WorkerProfile as WorkerProfileType } from "@/types"
import { formatWhatsApp } from "@/lib/utils"

interface WorkerProfileProps {
  worker: WorkerProfileType
}

export default function WorkerProfile({ worker }: WorkerProfileProps) {
  const avgRating = worker.avg_rating ?? 0
  const reviewCount = worker.review_count ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          {worker.avatar_url ? (
            <Image
              src={worker.avatar_url}
              alt={worker.name}
              width={120}
              height={120}
              className="rounded-2xl object-cover w-[120px] h-[120px]"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-2xl bg-amber-100 flex items-center justify-center text-4xl font-bold text-amber-600">
              {worker.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>

          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(avgRating)} size="md" />
            <span className="text-sm text-gray-600">
              {avgRating > 0 ? avgRating.toFixed(1) : 'Sin calificaciones'}
              {reviewCount > 0 && ` · ${reviewCount} ${reviewCount === 1 ? 'reseña' : 'reseñas'}`}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {worker.categories?.map(cat => (
              <Link key={cat.id} href={`/categoria/${cat.slug}`}>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 cursor-pointer">
                  {cat.icon} {cat.name}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-600" />
              {worker.location}
            </span>
            {worker.experience_years > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                {worker.experience_years} {worker.experience_years === 1 ? 'año de experiencia' : 'años de experiencia'}
              </span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <a
            href={formatWhatsApp(worker.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white gap-2 h-12 px-6 text-base">
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </Button>
          </a>
        </div>
      </div>

      {/* Bio */}
      {worker.bio && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Sobre mí</h2>
          <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
        </div>
      )}

      {/* Skills */}
      {worker.skills && worker.skills.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map(s => (
              <Badge key={s.id} variant="outline" className="text-sm">
                {s.skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Work photos */}
      {worker.photos && worker.photos.length > 0 && (
        <WorkerPhotoGrid photos={worker.photos} />
      )}
    </div>
  )
}
