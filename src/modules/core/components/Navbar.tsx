import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { config } from "../lib/config";
import ThemeToggle from "./ThemeToggle";
import SidebarMenu from "./SidebarMenu";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/contacto", label: "Contacto" },
  { href: "/seguimiento", label: "Seguimiento" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-32.png" alt={config.appName} width={32} height={32} className="h-8 w-auto" priority />
              <span className="text-2xl font-bold text-[var(--accent)]">{config.appName}</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {publicLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
              {session && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors text-sm font-medium"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  Panel
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center gap-3">
              {session && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  Panel
                </button>
              )}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]" aria-label="Menú">
                <svg className="h-6 w-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--bg-secondary)]">
            <div className="px-4 py-3 space-y-2">
              {publicLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>

      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
