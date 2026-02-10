import { requireUser } from "@/lib/auth/auth-page-helper";
import { redirect } from "next/navigation";
import { CVService } from "@/services/cv.service";
import { CVEditor } from "@/components/editor/cv-editor";
import { ValidationToastProvider } from "@/components/ui/validation-toast";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const userId = await requireUser();

  const { id } = await params;
  const cvData = await CVService.getCVDetail(id, userId);

  if (!cvData) {
    redirect("/create");
  }

  return (
    <ValidationToastProvider>
      <CVEditor cvId={id} initialData={cvData} />
    </ValidationToastProvider>
  );
}
