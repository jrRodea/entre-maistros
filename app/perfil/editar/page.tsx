import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WorkerForm from "@/components/workers/WorkerForm"
import { createServerSupabase } from "@/lib/supabase"
import type { WorkerProfile, WorkerSkill, Category } from "@/types"

export default async function EditarPerfilPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = createServerSupabase()
  const { data: worker } = await supabase
    .from('workers_with_stats')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (!worker) redirect('/perfil/crear')

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

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editar mi perfil</h1>
          <p className="text-gray-600 mt-2">
            Mantén tu perfil actualizado para que los clientes te encuentren fácilmente.
          </p>
        </div>

        <WorkerForm mode="edit" initialData={fullWorker} />
      </main>

      <Footer />
    </div>
  )
}
