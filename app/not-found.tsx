import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Hammer } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No encontramos esta página</h1>
        <p className="text-gray-500 mb-8">El perfil que buscas no existe o aún no está publicado.</p>
        <div className="flex gap-3">
          <Link href="/buscar">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">Buscar maestros</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Ir al inicio</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
