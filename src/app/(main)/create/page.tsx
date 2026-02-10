import { requireUser } from "@/lib/auth/auth-page-helper";
import { WizardStep } from "@/components/create/wizard-step";

export default async function Page1() {
  await requireUser();

  return (
    <main className="relative min-h-screen pt-16 pb-20 text-foreground">
      <div className="absolute inset-0 -z-10 min-h-full">
        <div className="absolute inset-0 bg-emerald-100 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-neutral-100))] dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-neutral-900))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)] bg-size-[20px_20px] dark:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <WizardStep />
      </div>
    </main>
  );
}
