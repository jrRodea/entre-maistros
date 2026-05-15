import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WorkerCard from "@/components/workers/WorkerCard"
import SearchBar from "@/components/search/SearchBar"
import { CATEGORIES } from "@/lib/categories"
import { createServerSupabase } from "@/lib/supabase"
import type { WorkerProfile } from "@/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find(c => c.slug === slug)
  if (!cat) return {}
  return {
    title: `${cat.icon} ${cat.name} en Tepeji del Río — Entre Maistros`,
    description: cat.description,
  }
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params
  const cat = CATEGORIES.find(c => c.slug === slug)
  if (!cat) notFound()

  const supabase = createServerSupabase()
  const { data } = await supabase
    .from('workers_with_stats')
    .select('*')
    .eq('is_published', true)
    .order('avg_rating', { ascending: false })

  const workers = ((data ?? []) as WorkerProfile[]).filter(w =>
    Array.isArray(w.categories) && w.categories.some(c => c.slug === slug)
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Category header */}
        <div className="bg-brand-verde rounded-2xl p-8 mb-8">
          <div className="text-5xl mb-3">{cat.icon}</div>
          <h1 className="font-display font-bold text-white text-3xl">{cat.name}</h1>
          <p className="font-sans text-brand-nopal mt-2">{cat.description}</p>
        </div>

        <div className="mb-6">
          <SearchBar defaultCategory={slug} />
        </div>

        {workers.length > 0 ? (
          <div>
            <p className="text-sm font-sans text-brand-verde-600 mb-4">
              {workers.length} {workers.length === 1 ? 'maistro disponible' : 'maistros disponibles'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map(worker => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-crema-300">
            <p className="font-sans text-brand-verde text-lg">Aún no hay {cat.name.toLowerCase()}s registrados.</p>
            <p className="mt-2 text-sm font-sans text-brand-verde-600">¿Eres {cat.name.toLowerCase()}? ¡Crea tu perfil!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
