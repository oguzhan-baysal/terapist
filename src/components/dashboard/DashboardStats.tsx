import { CalendarDays, CheckCircle, Clock, Wallet } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
      </div>
      <div className="text-primary-600 dark:text-primary-400">{icon}</div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
  </div>
);

export default function DashboardStats() {
  const stats = [
    {
      title: "Toplam Randevu",
      value: "24",
      icon: <CalendarDays className="h-6 w-6" />,
      description: "Bu ayki toplam randevu sayısı"
    },
    {
      title: "Bekleyen Randevu",
      value: "8",
      icon: <Clock className="h-6 w-6" />,
      description: "Onay bekleyen randevular"
    },
    {
      title: "Tamamlanan",
      value: "16",
      icon: <CheckCircle className="h-6 w-6" />,
      description: "Tamamlanan randevular"
    },
    {
      title: "Toplam Kazanç",
      value: "₺4,550",
      icon: <Wallet className="h-6 w-6" />,
      description: "Bu ayki toplam kazanç"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
} 