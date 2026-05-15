import Link from "next/link"
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
      <section className="bg-brand-crema py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-verde-100 text-brand-verde-700 px-4 py-1.5 rounded-full text-sm font-sans font-medium mb-6">
            📍 Tepeji del Río, Hidalgo
          </div>
          <h1 className="font-display font-bold text-brand-verde text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
            Encuentra gente que sí sabe{" "}
            <span className="text-brand-naranja italic">hacer el jale</span>
          </h1>
          <p className="font-sans text-brand-verde-600 text-lg mb-10 max-w-xl mx-auto">
            Conectamos a vecinos de Tepeji con plomeros, electricistas, albañiles y más. Trabajadores locales de confianza, con reseñas reales.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-brand-verde text-2xl mb-6">¿Qué necesitas?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-brand-crema-300 bg-brand-crema hover:border-brand-verde hover:bg-brand-verde-100 transition-all group text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-sans font-medium text-brand-verde-700 group-hover:text-brand-verde">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trabajadores destacados */}
      <section className="py-12 px-4 bg-brand-crema">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-brand-verde text-2xl">Maistros destacados</h2>
            <Link href="/buscar" className="font-sans text-brand-naranja text-sm font-semibold hover:underline">
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
            <div className="text-center py-12 bg-white rounded-2xl border border-brand-crema-300">
              <p className="font-sans text-brand-verde-600">Aún no hay maistros registrados.</p>
              <p className="mt-1 text-sm font-sans text-brand-crema-300">¡Sé el primero en crear tu perfil!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA maistros */}
      <section className="py-16 px-4 bg-brand-verde">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4">
            ¿Eres maistro?
          </h2>
          <p className="font-sans text-brand-nopal text-lg mb-8">
            Crea tu perfil gratis, muestra tu trabajo y consigue más clientes en Tepeji del Río.
          </p>
          <Link href="/perfil/crear">
            <Button size="lg" className="bg-brand-amarillo hover:bg-yellow-400 text-brand-verde font-sans font-bold rounded-xl text-base px-8">
              Crear mi perfil gratis
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
