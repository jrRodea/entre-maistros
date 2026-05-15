import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServerSupabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const categoria = searchParams.get('categoria') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '20')

  let query = supabase
    .from('workers_with_stats')
    .select('*')
    .eq('is_published', true)
    .order('avg_rating', { ascending: false })
    .limit(limit)

  if (q) {
    query = query.or(`name.ilike.%${q}%,bio.ilike.%${q}%`)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let workers = data ?? []

  if (categoria) {
    workers = workers.filter((w: { categories: Array<{ slug: string }> }) =>
      Array.isArray(w.categories) && w.categories.some((c) => c.slug === categoria)
    )
  }

  return NextResponse.json(workers)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const user = await currentUser()
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

  const { data: worker, error } = await supabase
    .from('worker_profiles')
    .insert({
      clerk_user_id: userId,
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

  await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_metadata: { role: 'worker', worker_slug: slug } }),
  }).catch(() => {})

  return NextResponse.json({ slug }, { status: 201 })
}
