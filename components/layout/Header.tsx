'use client'

import Link from "next/link"
import { useAuth, useUser, UserButton, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Hammer, Pencil, ShieldCheck } from "lucide-react"

export default function Header() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  const role = user?.publicMetadata?.role as string | undefined
  const isWorker = role === 'worker'
  const isAdmin = role === 'admin'
  const workerSlug = user?.publicMetadata?.worker_slug as string | undefined

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-verde shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
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
              {isWorker && workerSlug ? (
                /* Maistro: acceso rápido a su perfil público + editar */
                <div className="flex items-center gap-1.5">
                  <Link href={`/trabajador/${workerSlug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 border-brand-amarillo/60 text-brand-amarillo hover:bg-brand-amarillo hover:text-brand-verde hover:border-transparent font-sans gap-1.5 rounded-xl font-semibold"
                    >
                      <Hammer className="h-4 w-4" />
                      <span className="hidden sm:inline">Mi perfil</span>
                    </Button>
                  </Link>
                  <Link href="/perfil/editar" className="hidden sm:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 text-brand-nopal hover:text-white hover:bg-brand-verde-700 rounded-xl px-2"
                      aria-label="Editar perfil"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                /* Usuario normal: invitación a registrarse como maistro */
                <Link href="/perfil/crear">
                  <Button
                    size="sm"
                    className="h-10 bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl gap-1.5"
                  >
                    <Hammer className="h-4 w-4" />
                    <span className="hidden sm:inline">Ser maistro</span>
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 border-brand-amarillo/60 text-brand-amarillo hover:bg-brand-amarillo hover:text-brand-verde hover:border-transparent font-sans gap-1.5 rounded-xl font-semibold"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 border-brand-nopal/50 text-brand-nopal hover:bg-brand-verde-700 hover:text-white hover:border-transparent font-sans rounded-xl px-4"
                >
                  Entrar
                </Button>
              </SignInButton>
              <Link href="/perfil/crear">
                <Button
                  size="sm"
                  className="h-10 bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl gap-1.5 px-4"
                >
                  <Hammer className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Soy maistro</span>
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
