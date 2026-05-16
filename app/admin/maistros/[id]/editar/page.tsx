import { currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WorkerForm from '@/components/workers/WorkerForm'
import { createServerSupabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import type { WorkerProfile, WorkerSkill, Category } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditarMaistroPage({ params }: PageProps) {
  const user = await currentUser()
  if (!user || user.publicMetadata?.role !== 'admin') redirect('/')

  const { id } = await params
  const supabase = createServerSupabase()

  const { data: worker } = await supabase
    .from('workers_with_stats')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!worker) notFound()

  const [{ data: skills }, { data: photos }] = await Promise.all([
    supabase.from('worker_skills').select('*').eq('worker_id', worker.id),
    supabase.from('work_photos').select('*').eq('worker_id', worker.id),
  ])

  const fullWorker: WorkerProfile = {
    ...worker,
    skills: (skills ?? []) as WorkerSkill[],
    photos: photos ?? [],
    categories: (worker.categories ?? []) as Category[],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-brand-crema py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/admin" className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-verde-600 hover:text-brand-verde mb-4">
              <ArrowLeft className="h-4 w-4" /> Volver al panel
            </Link>
            <p className="font-sans text-brand-naranja text-sm font-semibold uppercase tracking-widest mb-1">Admin</p>
            <h1 className="font-display font-bold text-brand-verde text-2xl">Editar: {worker.name}</h1>
          </div>

          <div className="bg-white rounded-2xl border border-brand-crema-300 p-6">
            <WorkerForm mode="edit" variant="admin" initialData={fullWorker} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
