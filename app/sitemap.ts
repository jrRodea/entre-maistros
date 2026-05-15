import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/categories'
import { createServerSupabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://entre-maistros.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabase()
  const { data: workers } = await supabase
    .from('worker_profiles')
    .select('slug, created_at')
    .eq('is_published', true)

  const workerUrls: MetadataRoute.Sitemap = (workers ?? []).map(w => ({
    url: `${BASE_URL}/trabajador/${w.slug}`,
    lastModified: new Date(w.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${BASE_URL}/categoria/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...workerUrls,
  ]
}
