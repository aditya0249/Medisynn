import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ReminderToast from "./ReminderToast";

const GlobalReminderListener = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const getCurrentHHMM = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
      const current = getCurrentHHMM();

      reminders.forEach((r: any) => {
        if (!r.triggered && r.time === current) {
          audioRef.current?.play().catch(() => {});

          

          r.triggered = true;
        }

       
      });

      localStorage.setItem("reminders", JSON.stringify(reminders));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <audio ref={audioRef} src="/notification.mp3" preload="auto" />;
};

export default GlobalReminderListener;
