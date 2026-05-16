import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WorkerForm from '@/components/workers/WorkerForm'
import { ArrowLeft } from 'lucide-react'

export default async function AdminNuevoMaistroPage() {
  const user = await currentUser()
  if (!user || user.publicMetadata?.role !== 'admin') redirect('/')

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
            <h1 className="font-display font-bold text-brand-verde text-2xl">Dar de alta nuevo maistro</h1>
            <p className="font-sans text-brand-verde-600 text-sm mt-1">
              El perfil quedará publicado de inmediato y visible en el directorio.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-crema-300 p-6">
            <WorkerForm mode="create" variant="admin" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
