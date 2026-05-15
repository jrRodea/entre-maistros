import { Suspense } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import SearchBar from "@/components/search/SearchBar"
import CategoryFilter from "@/components/search/CategoryFilter"
import WorkerCard from "@/components/workers/WorkerCard"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerSupabase } from "@/lib/supabase"
import type { WorkerProfile } from "@/types"

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>
}

async function WorkerResults({ q, categoria }: { q: string; categoria: string }) {
  const supabase = createServerSupabase()
  let query = supabase
    .from('workers_with_stats')
    .select('*')
    .eq('is_published', true)
    .order('avg_rating', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,bio.ilike.%${q}%`)
  }

  const { data } = await query
  let workers = (data ?? []) as WorkerProfile[]

  if (categoria) {
    workers = workers.filter(w =>
      Array.isArray(w.categories) && w.categories.some(c => c.slug === categoria)
    )
  }

  if (!workers.length) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-brand-crema-300">
        <p className="font-sans text-brand-verde text-lg font-medium">No encontramos maistros para tu búsqueda.</p>
        <p className="mt-2 text-sm font-sans text-brand-verde-600">Intenta con otros términos o categorías.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm font-sans text-brand-verde-600 mb-4">
        {workers.length} {workers.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map(worker => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  )
}

function WorkerSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-brand-crema-300 rounded-2xl p-4 flex gap-4">
          <Skeleton className="w-[72px] h-[72px] rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function BuscarPage({ searchParams }: PageProps) {
  const { q = '', categoria = '' } = await searchParams

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <h1 className="font-display font-bold text-brand-verde text-2xl mb-6">
          {q ? `Resultados para "${q}"` : 'Buscar maistros'}
        </h1>

        <div className="space-y-6">
          <SearchBar defaultValue={q} defaultCategory={categoria} />

          <div>
            <p className="text-sm font-sans font-medium text-brand-verde mb-2">Filtrar por categoría:</p>
            <Suspense>
              <CategoryFilter selected={categoria} />
            </Suspense>
          </div>

          <Suspense fallback={<WorkerSkeleton />}>
            <WorkerResults q={q} categoria={categoria} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
