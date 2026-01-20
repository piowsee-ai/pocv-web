import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CVService } from "@/lib/services/cv.service";
import { CVEditor } from "@/components/editor/cv-editor";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const cvData = await CVService.getCVDetail(id, session.user.id);

  if (!cvData) {
    redirect("/page-1");
  }

  return (
    <main className="relative min-h-screen pt-16 pb-20 text-foreground">
      <div className="absolute inset-0 -z-10 min-h-full">
        <div className="absolute inset-0 bg-emerald-100 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-neutral-100))] dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-neutral-900))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-neutral-300)_1px,transparent_1px)] bg-size-[20px_20px] dark:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <CVEditor cvId={id} initialData={cvData} />
      </div>
    </main>
  );
}
