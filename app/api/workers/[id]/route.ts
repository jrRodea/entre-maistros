import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('workers_with_stats')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = createServerSupabase()

  const { data: worker } = await supabase
    .from('worker_profiles')
    .select('id, slug, clerk_user_id')
    .eq('id', id)
    .single()

  if (!worker) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  if (worker.clerk_user_id !== userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const body = await req.json()
  const { name, bio, age, experience_years, location, whatsapp_number, avatar_url, category_ids, skills, photo_urls } = body

  const { error } = await supabase
    .from('worker_profiles')
    .update({
      ...(name && { name: name.trim() }),
      ...(bio !== undefined && { bio: bio.trim() }),
      ...(age !== undefined && { age }),
      ...(experience_years !== undefined && { experience_years }),
      ...(location && { location: location.trim() }),
      ...(whatsapp_number && { whatsapp_number: whatsapp_number.replace(/\D/g, '') }),
      ...(avatar_url !== undefined && { avatar_url }),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (Array.isArray(category_ids)) {
    await supabase.from('worker_categories').delete().eq('worker_id', id)
    if (category_ids.length > 0) {
      const { data: cats } = await supabase.from('categories').select('id, slug').in('slug', category_ids)
      if (cats && cats.length > 0) {
        await supabase.from('worker_categories').insert(
          cats.map((c: { id: string }) => ({ worker_id: id, category_id: c.id }))
        )
      }
    }
  }

  if (Array.isArray(skills)) {
    await supabase.from('worker_skills').delete().eq('worker_id', id)
    if (skills.length > 0) {
      await supabase.from('worker_skills').insert(
        skills.map((skill: string) => ({ worker_id: id, skill }))
      )
    }
  }

  if (Array.isArray(photo_urls) && photo_urls.length > 0) {
    await supabase.from('work_photos').insert(
      photo_urls.map((url: string) => ({ worker_id: id, photo_url: url, caption: '' }))
    )
  }

  return NextResponse.json({ slug: worker.slug })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = createServerSupabase()
  const { data: worker } = await supabase
    .from('worker_profiles')
    .select('clerk_user_id')
    .eq('id', id)
    .single()

  if (!worker) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  if (worker.clerk_user_id !== userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  await supabase.from('worker_profiles').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
