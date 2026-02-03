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
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
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
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Sparkles,
      label: "AI Reviews",
      value: "Coming Soon",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50 dark:bg-violet-950/30",
      isText: true,
    },
    {
      icon: TrendingUp,
      label: "CV Score",
      value: "Coming Soon",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      isText: true,
    },
  ];

  // Loading skeleton
  if (isPending) {
    return (
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse dark:bg-gray-800 mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 animate-pulse"
            >
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="mt-3">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state - show error banner with retry
  if (isError) {
    return (
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {greeting()}, <span className="text-emerald-600">{userName}</span>!
            👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Siap membuat CV yang memukau hari ini?
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-3">
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
          {greeting()}, <span className="text-emerald-600">{userName}</span>! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Siap membuat CV yang memukau hari ini?
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl ${stat.bgColor} p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </p>
              <p
                className={`font-bold ${stat.isText ? "text-xs mt-1" : "text-2xl"} text-foreground`}
              >
                {stat.value}
              </p>
            </div>
            <div
              className={`absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-xl`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
