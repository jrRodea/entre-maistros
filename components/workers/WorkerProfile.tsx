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
    <div className="space-y-6">
      {/* Verde header card */}
      <div className="bg-brand-verde rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            {worker.avatar_url ? (
              <Image
                src={worker.avatar_url}
                alt={worker.name}
                width={112}
                height={112}
                className="rounded-2xl object-cover w-[112px] h-[112px] ring-2 ring-brand-amarillo/40"
              />
            ) : (
              <div className="w-[112px] h-[112px] rounded-2xl bg-brand-verde-700 flex items-center justify-center text-4xl font-display font-bold text-brand-amarillo">
                {worker.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
              {worker.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="font-display font-bold text-brand-amarillo">
                {avgRating > 0 ? avgRating.toFixed(1) : '—'}
              </span>
              {reviewCount > 0 && (
                <span className="text-sm font-sans text-brand-nopal">
                  · {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {worker.categories?.map(cat => (
                <Link key={cat.id} href={`/categoria/${cat.slug}`}>
                  <Badge className="bg-brand-verde-700 text-brand-nopal border-0 hover:bg-brand-verde-600 cursor-pointer font-sans rounded-full px-3">
                    {cat.icon} {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm font-sans text-brand-nopal">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {worker.location}
              </span>
              {worker.experience_years > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {worker.experience_years} {worker.experience_years === 1 ? 'año de experiencia' : 'años de experiencia'}
                </span>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <a
              href={formatWhatsApp(worker.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold rounded-xl gap-2 py-3 px-6 text-base h-auto">
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Content sections */}
      {worker.bio && (
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-display font-semibold text-brand-verde text-xl mb-3">Sobre mí</h2>
          <p className="font-sans text-brand-verde-600 leading-relaxed">{worker.bio}</p>
        </div>
      )}

      {worker.skills && worker.skills.length > 0 && (
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-display font-semibold text-brand-verde text-xl mb-3">Habilidades</h2>
          <p className="font-sans text-brand-verde-700 leading-relaxed">
            {worker.skills.map(s => s.skill).join(' · ')}
          </p>
        </div>
      )}

      {worker.photos && worker.photos.length > 0 && (
        <div className="bg-white rounded-2xl p-6">
          <WorkerPhotoGrid photos={worker.photos} />
        </div>
      )}
    </div>
  )
}
