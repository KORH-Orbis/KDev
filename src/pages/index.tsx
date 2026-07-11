import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import HeroSection from "@/modules/public/components/HeroSection";
import ServicesSection from "@/modules/public/components/ServicesSection";
import { config } from "@/modules/core/lib/config";

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${config.appName} - Reparación y desarrollo web`}</title>
        <meta name="description" content={config.appDescription} />
      </Head>
      <Layout>
        <HeroSection />
        <ServicesSection />
      </Layout>
    </>
  );
}
