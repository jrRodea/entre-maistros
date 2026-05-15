import Image from "next/image"
import type { WorkPhoto } from "@/types"

interface WorkerPhotoGridProps {
  photos: WorkPhoto[]
}

export default function WorkerPhotoGrid({ photos }: WorkerPhotoGridProps) {
  if (!photos.length) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Trabajos realizados</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map(photo => (
          <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
            <Image
              src={photo.photo_url}
              alt={photo.caption || 'Trabajo realizado'}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
