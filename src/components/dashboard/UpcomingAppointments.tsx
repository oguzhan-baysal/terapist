import { Calendar, Clock, User } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: "bekliyor" | "onaylandı" | "iptal";
}

const appointments: Appointment[] = [
  {
    id: "1",
    patientName: "Ahmet Yılmaz",
    date: "2024-03-20",
    time: "14:30",
    status: "onaylandı"
  },
  {
    id: "2",
    patientName: "Ayşe Demir",
    date: "2024-03-21",
    time: "10:00",
    status: "bekliyor"
  },
  {
    id: "3",
    patientName: "Mehmet Kaya",
    date: "2024-03-21",
    time: "15:45",
    status: "onaylandı"
  }
];

const statusStyles = {
  bekliyor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  onaylandı: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  iptal: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

export default function UpcomingAppointments() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Yaklaşan Randevular
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Önümüzdeki 7 gün içindeki randevularınız
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hasta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.patientName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(appointment.date).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.time}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[appointment.status]}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 