import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const type = formData.get('type') as string | null

  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Archivo demasiado grande (máx 5 MB)' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const path = `${userId}/${type === 'avatar' ? `avatar_${uniqueId}` : `photos/${uniqueId}`}.${ext}`

  const supabase = createServerSupabase()
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('work-photos')
    .upload(path, arrayBuffer, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('work-photos').getPublicUrl(path)
  return NextResponse.json({ url: urlData.publicUrl }, { status: 201 })
}
