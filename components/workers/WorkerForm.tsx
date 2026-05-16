'use client'

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { CATEGORIES } from "@/lib/categories"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from "lucide-react"
import type { WorkerProfile } from "@/types"

interface WorkerFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<WorkerProfile>
  variant?: 'default' | 'admin'
}

const inputClass = "border-brand-crema-300 focus:border-brand-verde focus:ring-brand-verde bg-white rounded-xl font-sans"
const labelClass = "font-sans font-medium text-brand-verde"

export default function WorkerForm({ mode, initialData, variant = 'default' }: WorkerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const photosInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [bio, setBio] = useState(initialData?.bio ?? '')
  const [age, setAge] = useState(initialData?.age?.toString() ?? '')
  const [experienceYears, setExperienceYears] = useState(initialData?.experience_years?.toString() ?? '')
  const [location, setLocation] = useState(initialData?.location ?? 'Tepeji del Río')
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp_number ?? '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories?.map(c => c.id) ?? []
  )
  const [skills, setSkills] = useState<string[]>(
    initialData?.skills?.map(s => s.skill) ?? []
  )
  const [skillInput, setSkillInput] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar_url ?? '')

  function addSkill() {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed])
    }
    setSkillInput('')
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles(prev => [...prev, ...files].slice(0, 6))
  }

  async function uploadFile(file: File, type: 'avatar' | 'photo'): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Error al subir archivo')
    return data.url as string
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('El nombre es requerido'); return }
    if (!whatsapp.trim()) { setError('El número de WhatsApp es requerido'); return }
    if (selectedCategories.length === 0) { setError('Selecciona al menos una categoría'); return }
    setLoading(true)
    setError('')

    try {
      let avatarUrl = initialData?.avatar_url ?? null
      if (avatarFile) avatarUrl = await uploadFile(avatarFile, 'avatar')

      const photoUrls: string[] = []
      for (const file of photoFiles) photoUrls.push(await uploadFile(file, 'photo'))

      const payload = {
        name: name.trim(),
        bio: bio.trim(),
        age: age ? parseInt(age) : null,
        experience_years: experienceYears ? parseInt(experienceYears) : 0,
        location: location.trim(),
        whatsapp_number: whatsapp.replace(/\D/g, ''),
        avatar_url: avatarUrl,
        category_ids: selectedCategories,
        skills,
        photo_urls: photoUrls,
      }

      let url: string
      let method: string
      if (variant === 'admin') {
        url = '/api/admin/workers'
        method = 'POST'
      } else {
        url = mode === 'create' ? '/api/workers' : `/api/workers/${initialData?.id}`
        method = mode === 'create' ? 'POST' : 'PATCH'
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al guardar')
      if (variant === 'admin') {
        router.push(`/admin?creado=${data.slug}`)
      } else {
        router.push(`/trabajador/${data.slug}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => avatarInputRef.current?.click()}
          className="w-20 h-20 rounded-2xl bg-brand-verde-100 flex items-center justify-center cursor-pointer hover:bg-brand-verde-200 transition-colors overflow-hidden flex-shrink-0 ring-2 ring-brand-crema-300"
        >
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <Upload className="h-6 w-6 text-brand-verde" />
          )}
        </div>
        <div>
          <p className={`${labelClass} text-sm`}>Foto de perfil</p>
          <p className="text-xs font-sans text-brand-verde-600">Haz clic para subir</p>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className={labelClass}>Nombre completo *</Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Juan García" className={inputClass} required />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio" className={labelClass}>Sobre ti</Label>
        <Textarea
          id="bio" value={bio} onChange={e => setBio(e.target.value)}
          placeholder="Describe tu experiencia, forma de trabajar, especialidades..."
          rows={4} className={`${inputClass} resize-none`}
        />
      </div>

      {/* Edad y experiencia */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="age" className={labelClass}>Edad</Label>
          <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="35" min={18} max={80} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="experience" className={labelClass}>Años de experiencia *</Label>
          <Input id="experience" type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} placeholder="10" min={0} max={60} className={inputClass} />
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-1.5">
        <Label htmlFor="location" className={labelClass}>Ubicación</Label>
        <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Tepeji del Río" className={inputClass} />
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <Label htmlFor="whatsapp" className={labelClass}>Número de WhatsApp *</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-brand-crema-300 bg-brand-crema text-sm font-sans text-brand-verde-600">
            +52
          </span>
          <Input id="whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="7712345678" className={`${inputClass} rounded-l-none`} />
        </div>
        <p className="text-xs font-sans text-brand-verde-600">Solo dígitos, sin el +52</p>
      </div>

      {/* Categorías */}
      <div className="space-y-2">
        <p className={`${labelClass} text-sm`}>Categorías * <span className="font-normal text-brand-verde-600">(selecciona las que apliquen)</span></p>
        <div className="grid grid-cols-2 gap-2 bg-brand-verde-100 rounded-2xl p-4">
          {CATEGORIES.map(cat => (
            <div key={cat.slug} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => {
                  setSelectedCategories(prev =>
                    prev.includes(cat.slug) ? prev.filter(c => c !== cat.slug) : [...prev, cat.slug]
                  )
                }}
                className="border-brand-verde-600 data-[state=checked]:bg-brand-verde data-[state=checked]:border-brand-verde"
              />
              <Label htmlFor={`cat-${cat.slug}`} className="font-sans text-brand-verde-700 cursor-pointer font-normal">
                {cat.icon} {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Habilidades */}
      <div className="space-y-2">
        <Label className={labelClass}>Habilidades específicas</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            placeholder="Ej. Soldadura, mosaico, pintura texturizada..."
            className={inputClass}
          />
          <Button type="button" variant="outline" onClick={addSkill} className="border-brand-verde text-brand-verde hover:bg-brand-verde-100 font-sans rounded-xl">
            Agregar
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map(skill => (
              <Badge key={skill} className="bg-brand-verde-100 text-brand-verde-700 border-0 rounded-full font-sans gap-1 px-3">
                {skill}
                <button type="button" onClick={() => setSkills(prev => prev.filter(s => s !== skill))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Fotos de trabajo */}
      <div className="space-y-2">
        <Label className={labelClass}>Fotos de trabajos realizados <span className="font-normal text-brand-verde-600">(hasta 6)</span></Label>
        <div
          onClick={() => photosInputRef.current?.click()}
          className="border-2 border-dashed border-brand-crema-300 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-verde hover:bg-brand-verde-100/50 transition-colors"
        >
          <Upload className="h-8 w-8 text-brand-verde-600 mx-auto mb-2" />
          <p className="text-sm font-sans text-brand-verde-600">Haz clic para subir fotos de tu trabajo</p>
          <p className="text-xs font-sans text-brand-crema-300 mt-1">JPG, PNG hasta 5 MB cada una</p>
        </div>
        {photoFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photoFiles.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-brand-crema-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoFiles(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 bg-brand-verde/70 text-white rounded-full p-0.5 hover:bg-brand-verde"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={photosInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosChange} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-sans">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl h-12 text-base"
      >
        {loading ? 'Guardando...' : variant === 'admin' ? 'Dar de alta maistro' : mode === 'create' ? 'Crear mi perfil' : 'Guardar cambios'}
      </Button>
    </form>
  )
}
