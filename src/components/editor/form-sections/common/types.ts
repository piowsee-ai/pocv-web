import type { FormData } from "@/types/editor-form-data";

export interface FormSectionProps {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}
