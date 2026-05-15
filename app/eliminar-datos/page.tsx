import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Eliminar mis datos — Entre Maistros",
  description: "Instrucciones para solicitar la eliminación de tus datos personales en Entre Maistros.",
}

export default function EliminarDatosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-brand-crema py-12 px-4">
        <div className="max-w-2xl mx-auto">

          <h1 className="font-display font-bold text-brand-verde text-3xl md:text-4xl mb-2">
            Eliminar mis datos
          </h1>
          <p className="font-sans text-brand-verde-600 text-sm mb-10">
            Última actualización: 15 de mayo de 2025
          </p>

          <div className="space-y-8 font-sans text-brand-verde-700 leading-relaxed">

            <section>
              <p>
                En Entre Maistros respetamos tu derecho a controlar tu información personal.
                Si deseas eliminar los datos que hemos recopilado sobre ti, sigue cualquiera
                de las opciones a continuación.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-4">
                Opción 1 — Eliminar tu cuenta desde la app
              </h2>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>Inicia sesión en <Link href="https://www.entre-maistros.com" className="text-brand-naranja underline">www.entre-maistros.com</Link>.</li>
                <li>Haz clic en tu foto de perfil (esquina superior derecha).</li>
                <li>Selecciona <span className="font-semibold">Gestionar cuenta</span>.</li>
                <li>Elige <span className="font-semibold">Eliminar cuenta</span> y confirma.</li>
              </ol>
              <p className="mt-4 text-sm bg-white border border-brand-crema-300 rounded-xl px-4 py-3">
                Al eliminar tu cuenta se borran: tu perfil, fotos de trabajo, reseñas escritas y todos tus datos personales en un plazo máximo de <span className="font-semibold">30 días</span>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-4">
                Opción 2 — Solicitar eliminación por correo
              </h2>
              <p className="mb-3">Escríbenos a:</p>
              <a
                href="mailto:contacto@entre-maistros.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20datos"
                className="inline-block bg-brand-naranja hover:bg-orange-600 text-white font-sans font-semibold rounded-xl px-6 py-3 transition-colors"
              >
                contacto@entre-maistros.com
              </a>
              <p className="mt-4">
                Incluye en tu mensaje el nombre y correo electrónico con los que te registraste.
                Procesaremos tu solicitud en un plazo máximo de <span className="font-semibold">30 días</span> y
                te confirmaremos por correo cuando se haya completado.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-4">
                Si iniciaste sesión con Facebook
              </h2>
              <p className="mb-3">
                Además de los pasos anteriores, puedes revocar el acceso de Entre Maistros
                a tu cuenta de Facebook directamente desde Meta:
              </p>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>Ve a <span className="font-semibold">Facebook → Configuración → Seguridad → Aplicaciones y sitios web</span>.</li>
                <li>Busca <span className="font-semibold">Entre Maistros</span> en la lista.</li>
                <li>Haz clic en <span className="font-semibold">Eliminar</span>.</li>
              </ol>
              <p className="mt-4 text-sm bg-white border border-brand-crema-300 rounded-xl px-4 py-3">
                Esto revoca el acceso de inicio de sesión con Facebook, pero para borrar completamente tus datos de nuestra plataforma usa la Opción 1 o la Opción 2.
              </p>
            </section>

            <section>
              <p className="text-sm text-brand-verde-600">
                ¿Tienes dudas? Consulta nuestra{" "}
                <Link href="/privacidad" className="text-brand-naranja underline">
                  Política de Privacidad
                </Link>{" "}
                o escríbenos a{" "}
                <a href="mailto:contacto@entre-maistros.com" className="text-brand-naranja underline">
                  contacto@entre-maistros.com
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
