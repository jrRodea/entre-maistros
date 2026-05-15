import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔧</div>
        <h1 className="font-display font-bold text-brand-verde text-2xl mb-2">
          No encontramos esta página
        </h1>
        <p className="font-sans text-brand-verde-600 mb-8">
          El perfil que buscas no existe o aún no está publicado.
        </p>
        <div className="flex gap-3">
          <Link href="/buscar">
            <Button className="bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl">
              Buscar maistros
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-brand-verde text-brand-verde hover:bg-brand-verde-100 font-sans rounded-xl">
              Ir al inicio
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
