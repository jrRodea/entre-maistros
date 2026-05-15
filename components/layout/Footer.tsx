import Link from "next/link"
import { Hammer } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-100 bg-amber-50 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 font-semibold text-amber-700">
          <Hammer className="h-4 w-4" />
          Entre Maistros
        </div>
        <p className="text-center">
          Conectando a Tepeji del Río con sus trabajadores de confianza
        </p>
        <div className="flex gap-4">
          <Link href="/buscar" className="hover:text-amber-700 transition-colors">Buscar</Link>
          <Link href="/perfil/crear" className="hover:text-amber-700 transition-colors">Soy maestro</Link>
        </div>
      </div>
    </footer>
  )
}
