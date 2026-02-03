"use client";

import Link from "next/link";
import { Edit, FileText, MoreVertical, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse dark:bg-gray-800" />
            ))}
        </div>
      </section>
    );
  }

  const CVs: CVList[] = data.data;

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12" id="cv-list">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Your CVs</h2>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            {/* TODO: create CV (dont forget to invalidateQuries on cv_list tanstack key after creating cv*/}
            <Link href="/create-cv">
                <Plus className="mr-2 h-4 w-4" />
                New CV
            </Link>
        </Button>
      </div>

      {CVs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center animate-in fade-in-50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No CVs created yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
            You haven't created any CVs yet. Start building your professional profile today.
          </p>
          <Button asChild variant="outline">
            <Link href="/create-cv">
              Create Your First CV
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CVs.map((cv) => (
            <Card key={cv.id} className="group relative overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="truncate pr-4" title={cv.title}>
                        {cv.title}
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
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
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription>
                    Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] w-full rounded-md bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm flex items-center justify-center text-gray-200 dark:from-neutral-900 dark:to-neutral-800 dark:border-neutral-700 transition-all duration-300 group-hover:shadow-md group-hover:border-emerald-200 dark:group-hover:border-emerald-800">
                    <FileText className="h-10 w-10 opacity-30 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="secondary" className="w-full">
                    <Link href={`/editor/${cv.id}`}>
                        Open Editor
                    </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
