"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const AppointmentModal = dynamic(() => import("@/components/appointment/AppointmentModal"), {
  ssr: false
});

interface AppointmentButtonProps {
  terapistId: string;
  workingHours?: { day: string; hours: string }[];
}

export default function AppointmentButton({ terapistId, workingHours }: AppointmentButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!session) {
      router.push('/giris');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        size="lg"
        onClick={handleClick}
        className="w-full md:w-auto"
      >
        Randevu Al
      </Button>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        terapistId={terapistId}
        workingHours={workingHours}
      />
    </>
  );
} 