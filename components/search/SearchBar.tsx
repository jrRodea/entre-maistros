'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchBarProps {
  defaultValue?: string
  defaultCategory?: string
  large?: boolean
}

export default function SearchBar({ defaultValue = '', defaultCategory = '', large }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (defaultCategory) params.set('categoria', defaultCategory)
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-crema-300 h-4 w-4" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Plomero, electricista, pintor..."
          className={`pl-10 rounded-xl border-brand-crema-300 bg-white focus:border-brand-verde focus:ring-brand-verde font-sans ${large ? 'h-12 text-base' : ''}`}
        />
      </div>
      <Button
        type="submit"
        className={`bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl ${large ? 'h-12 px-6' : ''}`}
      >
        Buscar
      </Button>
    </form>
  )
}
