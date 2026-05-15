import Link from "next/link"
import { Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import SearchBar from "@/components/search/SearchBar"
import WorkerCard from "@/components/workers/WorkerCard"
import { CATEGORIES } from "@/lib/categories"
import { createServerSupabase } from "@/lib/supabase"
import type { WorkerProfile } from "@/types"

async function getFeaturedWorkers(): Promise<WorkerProfile[]> {
  try {
    const supabase = createServerSupabase()
    const { data } = await supabase
      .from('workers_with_stats')
      .select('*')
      .eq('is_published', true)
      .order('avg_rating', { ascending: false })
      .limit(6)
    return (data ?? []) as WorkerProfile[]
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedWorkers()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Hammer className="h-3.5 w-3.5" />
            Tepeji del Río, Hidalgo
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Encuentra gente que sí sabe{" "}
            <span className="text-amber-600">hacer el jale</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Conectamos a vecinos de Tepeji con plomeros, electricistas, albañiles y más. Trabajadores locales de confianza, con reseñas reales.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Qué necesitas?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50 transition-all group text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trabajadores destacados */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Maestros destacados</h2>
            <Link href="/buscar" className="text-amber-700 text-sm font-medium hover:underline">
              Ver todos →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(worker => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Aún no hay maestros registrados.</p>
              <p className="mt-1 text-sm">¡Sé el primero en crear tu perfil!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA maestros */}
      <section className="py-16 px-4 bg-amber-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Eres maestro?</h2>
          <p className="text-amber-100 text-lg mb-8">
            Crea tu perfil gratis, muestra tu trabajo y consigue más clientes en Tepeji del Río.
          </p>
          <Link href="/perfil/crear">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 text-base px-8">
              Crear mi perfil gratis
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
