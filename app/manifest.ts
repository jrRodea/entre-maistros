import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Entre Maistros',
    short_name: 'Entre Maistros',
    description: 'Encuentra gente que sí sabe hacer el jale en Tepeji del Río',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A2E14',
    theme_color: '#1A2E14',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
