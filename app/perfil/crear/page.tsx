import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WorkerForm from "@/components/workers/WorkerForm"
import { createServerSupabase } from "@/lib/supabase"

export default async function CrearPerfilPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = createServerSupabase()
  const { data: existing } = await supabase
    .from('worker_profiles')
    .select('slug')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (existing) redirect(`/trabajador/${existing.slug}`)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crea tu perfil de maistro</h1>
          <p className="text-gray-600 mt-2">
            Tu perfil será público para que los vecinos de Tepeji te puedan encontrar y contactar.
          </p>
        </div>

        <WorkerForm mode="create" />
      </main>

      <Footer />
    </div>
  )
}
