import { requireUser } from "@/lib/auth/auth-page-helper";
import { WizardStep } from "@/components/create/wizard-step";

export default async function Page1() {
  await requireUser();

  return (
    <main className="min-h-screen bg-neutral-100 text-foreground">
      <WizardStep />
    </main>
  );
}
