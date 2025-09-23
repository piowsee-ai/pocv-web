import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/main-page/hero";
import { Newsletter } from "@/components/main-page/newsletter";
import { SocialProof } from "@/components/main-page/social-proof";
import { Faq } from "@/components/main-page/faq";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="relative min-h-screen pt-16 text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-violet-100 bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.100))] dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.900))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(theme(colors.neutral.300)_1px,transparent_1px)] bg-size-[20px_20px] dark:bg-[radial-gradient(theme(colors.neutral.700)_1px,transparent_1px)]"></div>
      </div>

      <Header session={session} />
      <Hero />
      <SocialProof />
      <Faq />
      <Newsletter />
      <Footer />
    </main>
  );
}