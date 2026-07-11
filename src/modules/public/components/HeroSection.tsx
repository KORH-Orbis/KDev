import Link from "next/link";
import { config } from "../../core/lib/config";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg)] to-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6">
            Reparación de{" "}
            <span className="text-[var(--accent)]">computadoras</span>
            ,{" "}
            <span className="text-[var(--accent)]">portátiles</span>{" "}
            y{" "}
            <span className="text-[var(--accent)]">teléfonos</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-4">
            Servicio técnico profesional con diagnóstico gratuito. También creamos tu página web.
          </p>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10">
            {config.guaranteeDays} días de garantía en todas nuestras reparaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              Solicitar servicio
            </Link>
            <Link
              href="/seguimiento"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              Consultar reparación
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--accent)] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--accent)] rounded-full blur-3xl" />
      </div>
    </section>
  );
}
