import type { Metadata } from "next"
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { esMX } from "@clerk/localizations"
import "./globals.css"

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Entre Maistros — Encuentra gente que sí sabe hacer el jale",
  description: "Conectamos a personas con trabajadores locales de confianza en Tepeji del Río. Plomeros, electricistas, albañiles y más.",
  metadataBase: new URL('https://www.entre-maistros.com'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Entre Maistros',
    description: 'Encuentra gente que sí sabe hacer el jale en Tepeji del Río',
    url: 'https://www.entre-maistros.com',
    siteName: 'Entre Maistros',
    images: [{ url: '/logo-horizontal.png', width: 1200, height: 630 }],
    locale: 'es_MX',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      localization={esMX}
      appearance={{
        variables: {
          colorPrimary: '#F07A30',
          colorBackground: '#F5F0E8',
          colorText: '#1A2E14',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
      }}
    >
      <html
        lang="es"
        className={`${fraunces.variable} ${plusJakartaSans.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  )
}
