import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (user.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const supabase = createServerSupabase()
  const body = await req.json()
  const { name, bio, age, experience_years, location, whatsapp_number, avatar_url, category_ids, skills, photo_urls } = body

  if (!name?.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  if (!whatsapp_number?.trim()) return NextResponse.json({ error: 'WhatsApp es requerido' }, { status: 400 })

  const baseSlug = slugify(name)
  let slug = baseSlug
  let attempt = 0
  while (true) {
    const { data: existing } = await supabase.from('worker_profiles').select('id').eq('slug', slug).maybeSingle()
    if (!existing) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const adminClerkId = `admin_created_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

  const { data: worker, error } = await supabase
    .from('worker_profiles')
    .insert({
      clerk_user_id: adminClerkId,
      name: name.trim(),
      slug,
      bio: bio?.trim() ?? '',
      age: age ?? null,
      experience_years: experience_years ?? 0,
      location: location?.trim() ?? 'Tepeji del Río',
      whatsapp_number: whatsapp_number.replace(/\D/g, ''),
      avatar_url: avatar_url ?? null,
      is_published: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (Array.isArray(category_ids) && category_ids.length > 0) {
    const { data: cats } = await supabase.from('categories').select('id, slug').in('slug', category_ids)
    if (cats && cats.length > 0) {
      await supabase.from('worker_categories').insert(
        cats.map((c: { id: string }) => ({ worker_id: worker.id, category_id: c.id }))
      )
    }
  }

  if (Array.isArray(skills) && skills.length > 0) {
    await supabase.from('worker_skills').insert(
      skills.map((skill: string) => ({ worker_id: worker.id, skill }))
    )
  }

  if (Array.isArray(photo_urls) && photo_urls.length > 0) {
    await supabase.from('work_photos').insert(
      photo_urls.map((url: string) => ({ worker_id: worker.id, photo_url: url, caption: '' }))
    )
  }

  return NextResponse.json({ slug }, { status: 201 })
}
