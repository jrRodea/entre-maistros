import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Política de Privacidad — Entre Maistros",
  description: "Conoce cómo Entre Maistros recopila, usa y protege tu información personal.",
}

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-brand-crema py-12 px-4">
        <div className="max-w-3xl mx-auto">

          <h1 className="font-display font-bold text-brand-verde text-3xl md:text-4xl mb-2">
            Política de Privacidad
          </h1>
          <p className="font-sans text-brand-verde-600 text-sm mb-10">
            Última actualización: 15 de mayo de 2025
          </p>

          <div className="space-y-8 font-sans text-brand-verde-700 leading-relaxed">

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">1. Quiénes somos</h2>
              <p>
                Entre Maistros es una plataforma en línea que conecta a vecinos de Tepeji del Río, Hidalgo,
                con trabajadores locales de confianza. Operamos a través del sitio web{" "}
                <Link href="https://www.entre-maistros.com" className="text-brand-naranja underline">
                  www.entre-maistros.com
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">2. Información que recopilamos</h2>
              <p className="mb-3">Cuando usas Entre Maistros podemos recopilar la siguiente información:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><span className="font-semibold">Datos de cuenta:</span> nombre, dirección de correo electrónico y foto de perfil, proporcionados al registrarte con correo, Google o Facebook.</li>
                <li><span className="font-semibold">Datos de perfil de maistro:</span> nombre, biografía, número de WhatsApp, ubicación, categorías de servicio, fotos de trabajo y años de experiencia.</li>
                <li><span className="font-semibold">Reseñas:</span> calificaciones y comentarios que escribes sobre otros maistros.</li>
                <li><span className="font-semibold">Datos de uso:</span> páginas visitadas y búsquedas realizadas dentro de la plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">3. Cómo usamos tu información</h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Crear y gestionar tu cuenta de usuario.</li>
                <li>Mostrar tu perfil público como maistro a quienes buscan servicios.</li>
                <li>Permitir que los vecinos te contacten vía WhatsApp.</li>
                <li>Mejorar la experiencia de búsqueda y el funcionamiento de la plataforma.</li>
                <li>Enviarte notificaciones relacionadas con tu cuenta (solo si lo autorizas).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">4. Compartición de información con terceros</h2>
              <p className="mb-3">No vendemos tu información personal. La compartimos únicamente con los siguientes proveedores de servicio que nos ayudan a operar la plataforma:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><span className="font-semibold">Clerk</span> — gestión de autenticación e identidad de usuarios.</li>
                <li><span className="font-semibold">Supabase</span> — almacenamiento de datos y archivos.</li>
                <li><span className="font-semibold">Vercel</span> — alojamiento y despliegue del sitio web.</li>
                <li><span className="font-semibold">Meta (Facebook / Instagram)</span> — únicamente cuando eliges iniciar sesión con Facebook; en ese caso, Meta comparte con nosotros tu nombre y correo electrónico.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">5. Inicio de sesión con Facebook</h2>
              <p>
                Si decides registrarte o iniciar sesión usando tu cuenta de Facebook, recibiremos de Meta tu nombre
                y dirección de correo electrónico para crear o acceder a tu cuenta en Entre Maistros.
                No publicamos en tu perfil de Facebook ni accedemos a tu lista de amigos.
                Puedes revocar el acceso en cualquier momento desde la configuración de tu cuenta de Facebook en{" "}
                <span className="font-semibold">Configuración → Aplicaciones y sitios web</span>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">6. Retención de datos</h2>
              <p>
                Conservamos tu información mientras tu cuenta esté activa. Si decides eliminar tu cuenta,
                borraremos tus datos personales en un plazo máximo de 30 días, excepto aquellos que debamos
                conservar por obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">7. Tus derechos</h2>
              <p className="mb-3">Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Acceder a la información que tenemos sobre ti.</li>
                <li>Corregir datos incorrectos o incompletos.</li>
                <li>Solicitar la eliminación de tu cuenta y datos personales.</li>
                <li>Retirar tu consentimiento en cualquier momento.</li>
              </ul>
              <p className="mt-3">
                Para ejercer cualquiera de estos derechos escríbenos a{" "}
                <a href="mailto:contacto@entre-maistros.com" className="text-brand-naranja underline">
                  contacto@entre-maistros.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">8. Seguridad</h2>
              <p>
                Utilizamos medidas técnicas y organizativas razonables para proteger tu información frente a
                accesos no autorizados. Sin embargo, ningún sistema de transmisión por internet es completamente seguro.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">9. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta política ocasionalmente. Cuando lo hagamos, actualizaremos la fecha
                al inicio de esta página. Te recomendamos revisarla periódicamente.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-brand-verde text-xl mb-3">10. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad, puedes escribirnos a{" "}
                <a href="mailto:contacto@entre-maistros.com" className="text-brand-naranja underline">
                  contacto@entre-maistros.com
                </a>{" "}
                o visitarnos en{" "}
                <Link href="https://www.entre-maistros.com" className="text-brand-naranja underline">
                  www.entre-maistros.com
                </Link>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
