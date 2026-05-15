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
      <p className="text-sm font-sans text-brand-verde-600 bg-brand-verde-100 rounded-xl p-3">
        <a href="/sign-in" className="text-brand-naranja font-semibold hover:underline">Inicia sesión</a> para dejar tu reseña.
      </p>
    )
  }

  if (success) {
    return (
      <div className="bg-brand-verde-100 border border-brand-verde-200 text-brand-verde font-sans rounded-xl p-4 text-sm font-medium">
        ¡Gracias por tu reseña! Ya está publicada.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-brand-verde-100 rounded-2xl p-4">
      <p className="text-sm font-sans font-medium text-brand-verde">Tu calificación</p>
      <StarRating rating={rating} interactive onChange={setRating} size="lg" />

      <Textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Cuéntanos cómo fue tu experiencia (opcional)"
        rows={3}
        className="bg-white border-brand-crema-300 focus:border-brand-verde focus:ring-brand-verde rounded-xl resize-none font-sans"
      />

      {error && <p className="text-sm font-sans text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl w-full"
      >
        {loading ? 'Guardando...' : 'Publicar reseña'}
      </Button>
    </form>
  )
}
