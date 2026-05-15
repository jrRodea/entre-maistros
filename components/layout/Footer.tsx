import Link from "next/link"
import { Hammer } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-verde py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-brand-amarillo" />
          <span className="font-display font-bold text-xl leading-none">
            <span className="text-brand-amarillo">Entre</span>
            <span className="text-brand-naranja"> Maistros</span>
          </span>
        </div>

        <p className="font-display italic text-brand-amarillo text-center text-sm">
          Conectando a Tepeji del Río con sus trabajadores de confianza
        </p>

        <div className="flex gap-6">
          <Link href="/buscar" className="font-sans text-brand-nopal hover:text-brand-amarillo transition-colors">
            Buscar
          </Link>
          <Link href="/perfil/crear" className="font-sans text-brand-nopal hover:text-brand-amarillo transition-colors">
            Soy maistro
          </Link>
        </div>
      </div>
    </footer>
  )
}
