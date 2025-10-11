import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { WizardStep } from "@/components/page-1/wizard-step";

export default async function Page1() {
  const session = await auth.api.getSession({ headers: await headers() });

  //TODO: pass session as a prop for authorization

  return (
    <main className="relative min-h-screen pt-16 pb-20 text-foreground">
      <div className="absolute inset-0 -z-10 min-h-full">
        <div className="absolute inset-0 bg-emerald-100 bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.100))] dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.900))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(theme(colors.neutral.300)_1px,transparent_1px)] bg-size-[20px_20px] dark:bg-[radial-gradient(theme(colors.neutral.700)_1px,transparent_1px)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <WizardStep />
      </div>
    </main>
  );
}
