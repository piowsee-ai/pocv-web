import { requireUser } from "@/lib/auth/auth-page-helper";
import { Header } from "@/components/home-page/header";
import { Footer } from "@/components/footer";
import { CVListSection } from "@/components/home-page/cv-list";
import { WelcomeStats } from "@/components/home-page/welcome-stats";
import { QuickActions } from "@/components/home-page/quick-actions";
import { AITools } from "@/components/home-page/ai-tools";
import { QueryProvider } from "@/components/providers/query-provider";

export default async function Home() {
  await requireUser();

  return (
    <QueryProvider>
      <main className="min-h-screen bg-neutral-100 pt-16 text-foreground">
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
