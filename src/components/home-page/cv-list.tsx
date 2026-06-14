"use client";

import Link from "next/link";
import {
  Edit,
  FileText,
  MoreVertical,
  Trash2,
  Plus,
  User,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CVList } from "@/types/cv";
import { useCVList } from "@/hooks/use-cv-list";

export function CVListSection() {
  const { data, isPending, isError } = useCVList();

  // failed to fetch - welcome-stats handles error UI with retry button
  if (isError) {
    return null;
  }

  // loading fetch
  if (isPending) {
    return (
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-xl border border-neutral-200 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  const CVs: CVList[] = data.data;

  return (
    <section
      className="container mx-auto max-w-7xl px-4 md:px-6 py-12"
      id="cv-list"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Your CVs</h2>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            New CV
          </Link>
        </Button>
      </div>

      {CVs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-dashed border-neutral-300 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">
            Belum ada CV
          </h3>
          <p className="mb-4 mt-2 text-sm text-neutral-500 max-w-sm">
            Kamu belum membuat CV. Mulai buat profil profesionalmu sekarang.
          </p>
          <Button asChild variant="outline">
            <Link href="/create">Buat CV Pertamamu</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CVs.map((cv) => (
            <div
              key={cv.id}
              className="rounded-xl bg-white border border-neutral-200 overflow-hidden transition-colors hover:border-emerald-300"
            >
              <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3
                    className="font-semibold text-neutral-900 truncate"
                    title={cv.title}
                  >
                    {cv.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Diperbarui:{" "}
                    {new Date(cv.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/editor/${cv.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* CV Preview */}
              {cv.preview ? (
                <div className="px-5 pb-3 space-y-2">
                  {cv.preview.name && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{cv.preview.name}</span>
                    </div>
                  )}
                  {cv.preview.education && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <GraduationCap className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{cv.preview.education}</span>
                    </div>
                  )}
                  {cv.preview.work && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Briefcase className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{cv.preview.work}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-5 pb-3 flex items-center justify-center py-4">
                  <FileText className="h-8 w-8 text-neutral-200" />
                </div>
              )}

              <div className="px-5 pb-5 pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Link href={`/editor/${cv.id}`}>Buka Editor</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
