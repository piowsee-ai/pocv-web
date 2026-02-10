import { Header } from "@/components/home-page/header";
import { Footer } from "@/components/footer";
import { CVListSection } from "@/components/home-page/cv-list";
import { WelcomeStats } from "@/components/home-page/welcome-stats";
import { QuickActions } from "@/components/home-page/quick-actions";
import { AITools } from "@/components/home-page/ai-tools";
import { QueryProvider } from "@/components/providers/query-provider";

export default function Home() {
  return (
    <QueryProvider>
      <main className="relative min-h-screen pt-16 text-foreground">
        <div className="absolute inset-0 -z-10 h-full w-full">
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-950">
              <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
          </div>
        </div>
        <Header />
        <WelcomeStats />
        <QuickActions />
        <CVListSection />
        <AITools />
        <Footer />
      </main>
    </QueryProvider>
  );
}
