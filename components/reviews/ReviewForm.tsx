'use client'

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import StarRating from "@/components/reviews/StarRating"

interface ReviewFormProps {
  workerId: string
}

export default function ReviewForm({ workerId }: ReviewFormProps) {
  const { user } = useUser()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError('Selecciona una calificación'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId, rating, comment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
      setRating(0)
      setComment('')
      setSuccess(true)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        <a href="/sign-in" className="text-amber-700 font-medium hover:underline">Inicia sesión</a> para dejar tu reseña.
      </p>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
        ¡Gracias por tu reseña! Ya está publicada.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-amber-50 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-700">Tu calificación</p>
      <StarRating rating={rating} interactive onChange={setRating} size="lg" />

      <Textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Cuéntanos cómo fue tu experiencia (opcional)"
        rows={3}
        className="bg-white resize-none"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white w-full">
        {loading ? 'Guardando...' : 'Publicar reseña'}
      </Button>
    </form>
  )
}
