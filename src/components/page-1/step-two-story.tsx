import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WorkExperience } from "@/types/form-data";
import { Button } from "@/components/ui/button";

interface StepTwoStoryProps {
  formData: {
    workExperiences: WorkExperience[];
  };
  formErrors: Record<string, string>;
  handleWorkExperienceChange: (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => void;
  addWorkExperience: () => void;
  removeWorkExperience: (index: number) => void;
}

export function StepTwoStory({
  formData,
  formErrors,
  handleWorkExperienceChange,
  addWorkExperience,
  removeWorkExperience,
}: StepTwoStoryProps) {
  const { workExperiences } = formData;
  return (
    <div className="space-y-2">
      {workExperiences.map((exp, i) => (
        <div
          key={i}
          className="relative space-y-6 rounded-lg border-2 bg-white px-6 pb-6 pt-2 shadow-sm"
        >
          <div className="-mx-6 px-6 pb-2 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Jabatan di Nama Perusahaan
            </h2>
            {workExperiences.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkExperience(i)}
                className="text-sm text-red-500 hover:underline"
              >
                Hapus
              </button>
            )}
          </div>

          <div>
            <Label htmlFor={`description-${i}`} className="mb-1 block">
              Ceritakan Pengalamanmu
            </Label>
            <TextArea
              id={`description-${i}`}
              value={exp.description}
              onChange={(e) =>
                handleWorkExperienceChange(i, "description", e.target.value)
              }
              placeholder="Tulis pengalaman kerja atau proyekmu secara bebas, misalnya: Saya memiliki pengalaman 5 tahun di PT Teknologi Maju sebagai UI/UX Designer, di mana saya mengerjakan..."
              className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
            />
            {formErrors[`description-${i}`] && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors[`description-${i}`]}
              </p>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addWorkExperience}
        className="text-[#00B37A] font-semibold hover:bg-transparent  hover:text-green-700 ml-2" variant="ghost"
      >
        + Tambah pekerjaan lain
      </Button>
    </div>
  );
}