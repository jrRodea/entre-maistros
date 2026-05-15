import { notFound } from "next/navigation"
import { Suspense } from "react"
import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WorkerProfile from "@/components/workers/WorkerProfile"
import ReviewList from "@/components/reviews/ReviewList"
import ReviewForm from "@/components/reviews/ReviewForm"
import { createServerSupabase } from "@/lib/supabase"
import type { WorkerProfile as WorkerProfileType, Review, WorkerSkill, WorkPhoto } from "@/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getWorker(slug: string) {
  try {
    const supabase = createServerSupabase()

    const { data: worker, error: workerError } = await supabase
      .from('workers_with_stats')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (workerError || !worker) return null

    const [{ data: skills }, { data: photos }, { data: reviews }] = await Promise.all([
      supabase.from('worker_skills').select('*').eq('worker_id', worker.id),
      supabase.from('work_photos').select('*').eq('worker_id', worker.id).order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').eq('worker_id', worker.id).order('created_at', { ascending: false }),
    ])

    return {
      worker: { ...worker, skills: skills ?? [], photos: photos ?? [] } as WorkerProfileType,
      reviews: (reviews ?? []) as Review[],
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getWorker(slug)
  if (!result) return {}
  const { worker } = result
  const cats = worker.categories?.map(c => c.name).join(', ') ?? ''
  return {
    title: `${worker.name} — ${cats} | Entre Maistros`,
    description: worker.bio || `Contacta a ${worker.name}, ${cats} en ${worker.location}.`,
  }
}

function ReviewsSection({ workerId, reviews }: { workerId: string; reviews: Review[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Reseñas{reviews.length > 0 ? ` (${reviews.length})` : ''}
      </h2>
      <ReviewForm workerId={workerId} />
      <ReviewList reviews={reviews} />
    </div>
  )
}

export default async function TrabajadorPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getWorker(slug)
  if (!result) notFound()

  const { worker, reviews } = result

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="space-y-10">
          <WorkerProfile worker={worker} />
          <hr className="border-gray-100" />
          <Suspense>
            <ReviewsSection workerId={worker.id} reviews={reviews} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
