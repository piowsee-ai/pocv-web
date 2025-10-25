import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/main-page/hero";
import { SocialProof } from "@/components/main-page/social-proof";
import { Showcase } from '@/components/main-page/showcase';
import { Benefits } from "@/components/main-page/benefits";
import { Problem } from "@/components/main-page/problem";
import { Faq } from "@/components/main-page/faq";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="relative min-h-screen pt-16 text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-white dark:bg-neutral-900"></div>
      </div>

      <Header session={session} />
      <Hero />
      <SocialProof />
      <Problem />
      <Showcase />
      <Benefits />
      <Faq />
      <Footer />
    </main>
  );
}