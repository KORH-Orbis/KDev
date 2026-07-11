import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import LoginForm from "@/modules/auth/components/LoginForm";
import { config } from "@/modules/core/lib/config";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="py-20 text-center text-[var(--text-secondary)]">Cargando...</div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{`Iniciar sesión - ${config.appName}`}</title>
      </Head>
      <Layout>
        <section className="py-20 sm:py-28">
          <div className="max-w-md mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Panel de administración
              </h1>
              <p className="text-[var(--text-secondary)]">
                Ingresá con tu email y contraseña para acceder al panel.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <LoginForm />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
