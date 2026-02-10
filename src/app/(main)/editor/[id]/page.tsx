import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CVService } from "@/services/cv.service";
import { CVEditor } from "@/components/editor/cv-editor";
import { ValidationToastProvider } from "@/components/ui/validation-toast";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const cvData = await CVService.getCVDetail(id, session.user.id);

  if (!cvData) {
    redirect("/page-1");
  }

  return (
    <ValidationToastProvider>
      <CVEditor cvId={id} initialData={cvData} />
    </ValidationToastProvider>
  );
}
