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
        <div className="mb-8">
          <div className="text-5xl mb-3">{cat.icon}</div>
          <h1 className="text-3xl font-bold text-gray-900">{cat.name}</h1>
          <p className="text-gray-600 mt-2">{cat.description}</p>
        </div>

        <div className="mb-6">
          <SearchBar defaultCategory={slug} />
        </div>

        {workers.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">{workers.length} {workers.length === 1 ? 'maestro disponible' : 'maestros disponibles'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map(worker => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Aún no hay {cat.name.toLowerCase()}s registrados.</p>
            <p className="mt-2 text-sm">¿Eres {cat.name.toLowerCase()}? ¡Crea tu perfil!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
