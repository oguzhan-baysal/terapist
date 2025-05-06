import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardLoading from "@/components/dashboard/DashboardLoading";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris");
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Hoş Geldiniz, {session.user?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Günlük aktivitelerinizi ve randevularınızı buradan takip edebilirsiniz.
        </p>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <div className="grid gap-6">
          <DashboardStats />
          <UpcomingAppointments />
          <QuickActions />
        </div>
      </Suspense>
    </main>
  );
} 