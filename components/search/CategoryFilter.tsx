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
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
            selected === cat.slug
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700'
          )}
        >
          <span>{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  )
}
