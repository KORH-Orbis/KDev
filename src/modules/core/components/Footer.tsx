import Link from "next/link";
import { config } from "../lib/config";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[var(--accent)] mb-4">{config.appName}</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Servicio técnico profesional de computadoras, portátiles y teléfonos. Desarrollo web a medida.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Servicios</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>Reparación de PCs</li>
              <li>Reparación de portátiles</li>
              <li>Reparación de teléfonos</li>
              <li>Desarrollo web</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quienes-somos" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/seguimiento" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  Seguimiento
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>{config.phone}</li>
              <li>{config.contactEmail}</li>
              <li>{config.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--bg)] mt-8 pt-8 text-center text-sm text-[var(--text-secondary)]">
          &copy; {new Date().getFullYear()} {config.appName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
