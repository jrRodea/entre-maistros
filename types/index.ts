export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
}

export interface WorkerProfile {
  id: string
  clerk_user_id: string
  name: string
  slug: string
  bio: string
  age: number
  experience_years: number
  location: string
  whatsapp_number: string
  avatar_url: string | null
  is_published: boolean
  created_at: string
  categories?: Category[]
  skills?: WorkerSkill[]
  photos?: WorkPhoto[]
  avg_rating?: number
  review_count?: number
}

export interface WorkerSkill {
  id: string
  worker_id: string
  skill: string
}

export interface WorkPhoto {
  id: string
  worker_id: string
  photo_url: string
  caption: string
  created_at: string
}

export interface Review {
  id: string
  worker_id: string
  reviewer_clerk_id: string
  reviewer_name: string
  rating: number
  comment: string
  created_at: string
}
