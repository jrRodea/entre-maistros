'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  selected?: string
}

export default function CategoryFilter({ selected }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === selected) {
      params.delete('categoria')
    } else {
      params.set('categoria', slug)
    }
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => (
        <button
          key={cat.slug}
          onClick={() => handleSelect(cat.slug)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-sans font-medium border-0 transition-colors',
            selected === cat.slug
              ? 'bg-brand-verde text-brand-amarillo'
              : 'bg-brand-crema-200 text-brand-verde-700 hover:bg-brand-verde-100'
          )}
        >
          <span>{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  )
}
