import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WorkExperience } from "@/types/form-data";
import { Button } from "@/components/ui/button";

interface StepTwoProps {
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

export function StepTwoForm({
  formData,
  formErrors,
  handleWorkExperienceChange,
  addWorkExperience,
  removeWorkExperience,
}: StepTwoProps) {
  const { workExperiences } = formData;
  return (
    <div className="space-y-4">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor={`position-${i}`} className="mb-1 block">
                Jabatan <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`position-${i}`}
                value={exp.position}
                onChange={(e) =>
                  handleWorkExperienceChange(i, "position", e.target.value)
                }
                placeholder="Jabatan"
                className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {formErrors[`position-${i}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors[`position-${i}`]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`company-${i}`} className="mb-1 block">
                Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`company-${i}`}
                value={exp.company}
                onChange={(e) =>
                  handleWorkExperienceChange(i, "company", e.target.value)
                }
                placeholder="Nama Perusahaan"
                className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {formErrors[`company-${i}`] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors[`company-${i}`]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor={`startDate-${i}`} className="mb-1 block">
                Tanggal Mulai
              </Label>
              <Input
                id={`startDate-${i}`}
                value={exp.startDate}
                onChange={(e) =>
                  handleWorkExperienceChange(i, "startDate", e.target.value)
                }
                placeholder="MM / YYYY"
                className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div>
              <Label htmlFor={`endDate-${i}`} className="mb-1 block">
                Tanggal Akhir
              </Label>
              <Input
                id={`endDate-${i}`}
                value={exp.endDate}
                onChange={(e) =>
                  handleWorkExperienceChange(i, "endDate", e.target.value)
                }
                placeholder="MM / YYYY"
                className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div>
              <Label htmlFor={`city-${i}`} className="mb-1 block">
                Kota
              </Label>
              <Input
                id={`city-${i}`}
                value={exp.city}
                onChange={(e) =>
                  handleWorkExperienceChange(i, "city", e.target.value)
                }
                placeholder="Nama Kota"
                className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`description-${i}`} className="mb-1 block">
              Deskripsi
            </Label>
            <TextArea
              id={`description-${i}`}
              value={exp.description}
              onChange={(e) =>
                handleWorkExperienceChange(i, "description", e.target.value)
              }
              placeholder="Ceritakan tanggung jawab dan pencapaianmu di posisi ini..."
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