import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { createServerSupabase } from '@/lib/supabase'
import { UserPlus, Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function WorkerCount() {
  const supabase = createServerSupabase()
  const { count } = await supabase
    .from('worker_profiles')
    .select('*', { count: 'exact', head: true })
  return <span className="font-display font-bold text-4xl text-brand-amarillo">{count ?? 0}</span>
}

async function WorkerList() {
  const supabase = createServerSupabase()
  const { data: workers } = await supabase
    .from('worker_profiles')
    .select('id, name, slug, whatsapp_number, is_published, created_at')
    .order('created_at', { ascending: false })

  if (!workers?.length) {
    return <p className="font-sans text-brand-verde-600 text-sm">Aún no hay maistros registrados.</p>
  }

  return (
    <div className="space-y-2">
      {workers.map(w => (
        <div key={w.id} className="bg-white rounded-2xl border border-brand-crema-300 px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-sans font-semibold text-brand-verde truncate">{w.name}</p>
            <p className="font-sans text-xs text-brand-verde-600">/{w.slug}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/trabajador/${w.slug}`}>
              <Button variant="outline" size="sm" className="border-brand-verde-300 text-brand-verde-600 hover:bg-brand-verde-100 font-sans rounded-xl text-xs h-8">
                Ver
              </Button>
            </Link>
            <Link href={`/admin/maistros/${w.id}/editar`}>
              <Button size="sm" className="bg-brand-naranja hover:bg-orange-600 text-white font-sans rounded-xl gap-1.5 text-xs h-8">
                <Pencil className="h-3 w-3" /> Editar
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ creado?: string }> }) {
  const user = await currentUser()
  if (!user || user.publicMetadata?.role !== 'admin') redirect('/')

  const { creado } = await searchParams

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-brand-crema py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">

          <div>
            <p className="font-sans text-brand-naranja text-sm font-semibold uppercase tracking-widest mb-1">Panel de administración</p>
            <h1 className="font-display font-bold text-brand-verde text-3xl">Hola, {user.firstName} 👋</h1>
          </div>

          {creado && (
            <div className="bg-brand-verde text-white rounded-2xl px-6 py-4 font-sans flex items-center justify-between">
              <span>✅ Maistro <span className="font-semibold">{creado}</span> dado de alta correctamente.</span>
              <Link href={`/trabajador/${creado}`} className="underline text-brand-amarillo text-sm">Ver perfil →</Link>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-verde rounded-2xl p-6">
              <p className="font-sans text-brand-nopal text-sm mb-1">Maistros registrados</p>
              <Suspense fallback={<span className="font-display font-bold text-4xl text-brand-amarillo">…</span>}>
                <WorkerCount />
              </Suspense>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-brand-crema-300 flex flex-col justify-between">
              <p className="font-sans text-brand-verde-600 text-sm mb-4">Dar de alta un nuevo maistro manualmente</p>
              <Link href="/admin/maistros/nuevo">
                <Button className="w-full bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nuevo maistro
                </Button>
              </Link>
            </div>
          </div>

          {/* Lista de maistros */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-brand-verde text-lg">Maistros registrados</h2>
              <Link href="/admin/maistros/nuevo">
                <Button size="sm" className="bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl gap-1.5">
                  <UserPlus className="h-4 w-4" /> Nuevo
                </Button>
              </Link>
            </div>
            <Suspense fallback={<p className="text-sm font-sans text-brand-verde-600">Cargando...</p>}>
              <WorkerList />
            </Suspense>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
