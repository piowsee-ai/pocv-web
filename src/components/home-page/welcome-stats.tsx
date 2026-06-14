"use client";

import { FileText, Clock, Sparkles, TrendingUp } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { useCVList } from "@/hooks/use-cv-list";

export function WelcomeStats() {
  const { data: session } = useSession();
  const { data, isPending, isError, refetch } = useCVList();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };

  const userName = session?.user?.name?.split(" ")[0] || "User";

  const stats = [
    {
      icon: FileText,
      label: "Total CVs",
      value: isPending || isError ? "-" : data?.data?.length || 0,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Clock,
      label: "Last Update",
      value:
        isPending || isError
          ? "-"
          : data?.data?.[0]?.updatedAt
            ? new Date(data.data[0].updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })
            : "N/A",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Sparkles,
      label: "AI Reviews",
      value: "Coming Soon",
      color: "bg-violet-100 text-violet-600",
      isText: true,
    },
    {
      icon: TrendingUp,
      label: "CV Score",
      value: "Coming Soon",
      color: "bg-orange-100 text-orange-600",
      isText: true,
    },
  ];

  // Loading skeleton
  if (isPending) {
    return (
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-neutral-200 p-4 animate-pulse"
            >
              <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
              <div className="mt-3">
                <div className="h-3 w-16 bg-neutral-200 rounded" />
                <div className="h-6 w-10 bg-neutral-200 rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {greeting()}, <span className="text-emerald-600">{userName}</span>!
          </h1>
          <p className="text-neutral-500 mt-1">
            Siap membuat CV yang memukau hari ini?
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 mb-3">
            Gagal memuat data. Silakan coba lagi.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {greeting()}, <span className="text-emerald-600">{userName}</span>!
        </h1>
        <p className="text-neutral-500 mt-1">
          Siap membuat CV yang memukau hari ini?
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl bg-white border border-neutral-200 p-4"
          >
            <div className={`inline-flex p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="mt-3">
              <p className="text-xs text-neutral-500 font-medium">
                {stat.label}
              </p>
              <p
                className={`font-bold ${stat.isText ? "text-xs mt-1" : "text-2xl"} text-neutral-900`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
