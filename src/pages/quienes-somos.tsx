import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import { config } from "@/modules/core/lib/config";

const valores = [
  {
    titulo: "Transparencia",
    descripcion: "Te explicamos cada paso del proceso, sin letra pequeña. Presupuestos claros y sin sorpresas.",
  },
  {
    titulo: "Calidad",
    descripcion: "Usamos repuestos de primera calidad y seguimos procesos rigurosos para garantizar el mejor resultado.",
  },
  {
    titulo: "Rapidez",
    descripcion: "Sabemos que tu equipo es importante. Trabajamos con los mejores tiempos de entrega del mercado.",
  },
  {
    titulo: "Garantía",
    descripcion: `Todas nuestras reparaciones cuentan con ${config.guaranteeDays} días de garantía. Tu tranquilidad es nuestra prioridad.`,
  },
];

export default function QuienesSomos() {
  return (
    <>
      <Head>
        <title>{`Quiénes somos - ${config.appName}`}</title>
        <meta name="description" content={`Conoce a ${config.appName}, servicio técnico profesional.`} />
      </Head>
      <Layout>
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
                Quiénes somos
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                En <span className="text-[var(--accent)] font-semibold">{config.appName}</span> nos dedicamos a la
                reparación de computadoras, notebooks, celulares y tablets. Combinamos experiencia técnica
                con un servicio rápido y transparente. También creamos sitios web modernos para negocios y
                emprendedores. Creemos en la tecnología como herramienta para crecer, y trabajamos para que
                vos también lo creas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {valores.map((v) => (
                <div
                  key={v.titulo}
                  className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]"
                >
                  <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">{v.titulo}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
