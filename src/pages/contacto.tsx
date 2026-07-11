import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import ContactForm from "@/modules/public/components/ContactForm";
import { config } from "@/modules/core/lib/config";

export default function Contacto() {
  return (
    <>
      <Head>
        <title>{`Contacto - ${config.appName}`}</title>
        <meta name="description" content={`Contacta con ${config.appName} para solicitar servicio técnico o desarrollo web.`} />
      </Head>
      <Layout>
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
                Contacto
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                Cuéntanos qué necesitas y te responderemos lo antes posible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="lg:col-span-2">
                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Envíanos un mensaje</h2>
                  <ContactForm />
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Información</h3>
                  <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                    <li className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{config.address}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{config.phone}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{config.contactEmail}</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Horario</h3>
                  <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <li>Lunes a Viernes: 9:00 - 18:00</li>
                    <li>Sábados: 9:00 - 13:00</li>
                    <li>Domingos: Cerrado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
