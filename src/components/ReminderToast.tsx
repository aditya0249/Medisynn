import React from "react";

type ReminderToastProps = {
  message: string;
  time: string;
  onClose: () => void; // ✅ ADD THIS
};
const ReminderToast = ({ message, time }: { message: string; time: string }) => {
  return (
    <div
      className="
        w-[360px]
        rounded-2xl 
        p-4 
        flex 
        items-center 
        gap-4 
        shadow-xl
        text-white
        bg-gradient-to-r from-[#1DA1F2] to-[#36D1DC]
        animate-slideInOut
      "
    >
      <div
        className="
          w-12 
          h-12 
          rounded-xl 
          bg-white/25 
          backdrop-blur-sm 
          flex 
          items-center 
          justify-center 
          text-2xl
        "
      >
        🔔
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-[17px] leading-tight">
          {message}
        </span>
        <span className="text-white/90 text-sm">{time}</span>
      </div>
    </div>
  );
};

export default ReminderToast;
