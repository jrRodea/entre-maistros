'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Hammer } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-amber-700">
          <Hammer className="h-6 w-6" />
          Entre Maistros
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/buscar"
            className={`font-medium transition-colors hover:text-amber-700 ${pathname?.startsWith('/buscar') ? 'text-amber-700' : 'text-gray-600'}`}
          >
            Buscar
          </Link>
          {isSignedIn && (
            <Link
              href="/perfil/editar"
              className={`font-medium transition-colors hover:text-amber-700 ${pathname?.startsWith('/perfil') ? 'text-amber-700' : 'text-gray-600'}`}
            >
              Mi perfil
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Entrar</Button>
              </SignInButton>
              <Link href="/perfil/crear">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Soy maestro
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
