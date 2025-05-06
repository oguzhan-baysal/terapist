import { CalendarPlus, MessageSquarePlus, Settings, Users } from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const QuickAction = ({ icon, title, description, href }: QuickActionProps) => (
  <Link
    href={href}
    className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
  >
    <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  </Link>
);

export default function QuickActions() {
  const actions = [
    {
      icon: <CalendarPlus className="h-6 w-6" />,
      title: "Yeni Randevu",
      description: "Yeni bir randevu oluştur",
      href: "/randevular/yeni"
    },
    {
      icon: <MessageSquarePlus className="h-6 w-6" />,
      title: "Mesaj Gönder",
      description: "Hastalarınıza mesaj gönderin",
      href: "/mesajlar/yeni"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Hasta Listesi",
      description: "Tüm hastalarınızı görüntüleyin",
      href: "/hastalar"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Ayarlar",
      description: "Hesap ayarlarınızı yönetin",
      href: "/ayarlar"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Hızlı İşlemler
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sık kullanılan işlemlere hızlıca erişin
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
} 