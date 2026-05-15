'use client'

import Link from "next/link"
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Hammer, UserCircle } from "lucide-react"

export default function Header() {
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-verde shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Hammer className="h-6 w-6 text-brand-amarillo" />
          <span className="font-display font-bold text-xl leading-none">
            <span className="text-brand-amarillo">Entre</span>
            <span className="text-brand-naranja"> Maistros</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/buscar" className="font-sans text-brand-nopal hover:text-white transition-colors">
            Buscar
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link href="/perfil/editar">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand-nopal/50 text-brand-nopal hover:bg-brand-verde-700 hover:text-white hover:border-transparent font-sans gap-1.5 rounded-xl"
                >
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Mi perfil</span>
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-brand-nopal hover:text-white hover:bg-brand-verde-700 font-sans rounded-xl">
                  Entrar
                </Button>
              </SignInButton>
              <Link href="/perfil/crear">
                <Button size="sm" className="bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl">
                  <span className="hidden sm:inline">Soy maestro</span>
                  <span className="sm:hidden">Únete</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
