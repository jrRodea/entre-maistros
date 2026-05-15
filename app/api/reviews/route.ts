import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const user = await currentUser()
  const supabase = createServerSupabase()
  const body = await req.json()

  const { worker_id, rating, comment } = body

  if (!worker_id) return NextResponse.json({ error: 'worker_id requerido' }, { status: 400 })
  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Calificación inválida (1-5)' }, { status: 400 })

  const fullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''
  const reviewerName = (fullName || (user?.emailAddresses[0]?.emailAddress?.split('@')[0])) ?? 'Usuario'

  const { data, error } = await supabase
    .from('reviews')
    .upsert({
      worker_id,
      reviewer_clerk_id: userId,
      reviewer_name: reviewerName,
      rating,
      comment: comment?.trim() ?? '',
    }, { onConflict: 'worker_id,reviewer_clerk_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
