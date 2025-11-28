"use client";

import React, { useEffect, useState, useRef } from "react";
import { Calendar, Heart, Bell, TrendingUp, Activity } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import ReminderToast from "@/components/ReminderToast";


// =============================
// Type Definitions
// =============================
declare global {
  interface Window {
    lastSavedData?: string;
  }
}


type StatRecord = { value: string; date: string };
type HealthRecord = { id: number; date: string; condition: string; doctor: string; notes: string };
type WellnessTip = { id: number; title: string; description: string; icon?: string };
type Reminder = { id: number; time: string; message: string; triggered?: boolean };

// =============================
// Backend Base URL
// =============================
const API_BASE = "http://localhost:5000/dashboard";

// =============================
// Toast Helpers (Custom Styles)
// =============================
const showSuccess = (msg: string) =>
  toast.success(msg, {
    style: { background: "#4ade80", color: "#fff", fontSize: "15px" },
  });

const showError = (msg: string) =>
  toast(msg, {
    icon: (
      <div
        style={{
          background: "#dc2626", // just 10% darker than toast red
          color: "white",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        ✕
      </div>
    ),
    style: {
      background: "#ef4444", // original toast red
      color: "#fff",
      fontSize: "15px",
    },
  });


const showWarning = (msg: string) =>
  toast(msg, {
    icon: "⚠️",
    style: { background: "#facc15", color: "#000", fontSize: "15px" },
  });

const Dashboard: React.FC = () => {
  const location = useLocation();

useEffect(() => {
  if (location.state?.justLoggedIn) {
    toast.success(`Welcome back, ${localStorage.getItem("userName") || "User"}!`);
  }
}, [location.state]);

  const [activeTab, setActiveTab] = useState("health");

  const [userEmail, setUserEmail] = useState<string>("");
  const [isEmailLoaded, setIsEmailLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // States for all sections
  const [heartRate, setHeartRate] = useState("");
  const [stepsToday, setStepsToday] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");

  const [heartRateHistory, setHeartRateHistory] = useState<StatRecord[]>([]);
  const [stepsHistory, setStepsHistory] = useState<StatRecord[]>([]);
  const [bpHistory, setBpHistory] = useState<StatRecord[]>([]);

  const [healthHistory, setHealthHistory] = useState<HealthRecord[]>([]);
  const [wellnessTips, setWellnessTips] = useState<WellnessTip[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [healthForm, setHealthForm] = useState({ date: "", condition: "", doctor: "", notes: "" });
  const [wellnessForm, setWellnessForm] = useState({ title: "", description: "", icon: "💡" });
  const [reminderForm, setReminderForm] = useState({ time: "", message: "" });

  const audioRef = useRef<HTMLAudioElement>(null);

  // =============================
  // Load user email + dashboard data
  // =============================
  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("userEmail");
    const email = emailFromState || emailFromStorage;

    if (!email) return;

    setUserEmail(email);
    setIsEmailLoaded(true);

    fetch(`http://localhost:5000/dashboard/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setHeartRateHistory(data.heartRateHistory || []);
        setStepsHistory(data.stepsHistory || []);
        setBpHistory(data.bpHistory || []);
        setHealthHistory(data.healthHistory || []);
        setWellnessTips(data.wellnessTips || []);
        setReminders(data.reminders || []);

        setIsDataLoaded(true);
      })
      .catch(() => showError("Failed to load data!"));
  }, [location.key]);

  // =============================
  // Auto-save (SAFE)
  // =============================
useEffect(() => {
  if (!userEmail || !isEmailLoaded || !isDataLoaded) return;

  // Create a stable string of current data
  const currentData = JSON.stringify({
    heartRateHistory,
    stepsHistory,
    bpHistory,
    healthHistory,
    wellnessTips,
    reminders,
  });

  // If data has NOT changed from last save → SKIP saving
  if (window.lastSavedData === currentData) {
    return; // 🔥 STOP infinite loop
  }

  // Save current data as last saved snapshot
  window.lastSavedData = currentData;

  console.log("🔍 Saving dashboard for:", userEmail);
  console.log("📦 Payload:", {
    heartRateHistory,
    stepsHistory,
    bpHistory,
    healthHistory,
    wellnessTips,
    reminders,
  });

  fetch(`${API_BASE}/${userEmail}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: currentData,
  })
    .then(() => console.log("✅ Dashboard updated for user:", userEmail))
    .catch((err) => console.log("❌ Save error:", err));
}, [
  heartRateHistory,
  stepsHistory,
  bpHistory,
  healthHistory,
  wellnessTips,
  reminders,
  isDataLoaded,
]);


  // =============================
  // Reminder Notification Logic
  // =============================
  const getCurrentHHMM = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentHHMM();
      setReminders((prev) =>
        prev.map((r) => {
          if (!r.triggered && r.time === current) {
            audioRef.current?.play().catch(() => {});
            toast.custom(
  <ReminderToast message={r.message} time={r.time} />,
  {
    duration: 5000,
    position: "top-center",
  }
);


            return { ...r, triggered: true };
          }
          if (r.triggered && r.time !== current) return { ...r, triggered: false };
          return r;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =============================
  // Add Handlers
  // =============================
  const addHeartRate = () => {
    if (!heartRate) return showError("Enter a Heart Rate!");
    const today = new Date().toLocaleDateString();
    setHeartRateHistory((p) => [...p, { value: heartRate, date: today }]);
    setHeartRate("");
    showSuccess("Heart Rate added!");
  };

  const addSteps = () => {
    if (!stepsToday) return showError("Enter Steps!");
    const today = new Date().toLocaleDateString();
    setStepsHistory((p) => [...p, { value: stepsToday, date: today }]);
    setStepsToday("");
    showSuccess("Steps added!");
  };

  const addBP = () => {
    if (!bloodPressure) return showError("Enter Blood Pressure!");
    const today = new Date().toLocaleDateString();
    setBpHistory((p) => [...p, { value: bloodPressure, date: today }]);
    setBloodPressure("");
    showSuccess("Blood Pressure added!");
  };

  const addHealthRecord = () => {
    if (!healthForm.date.trim())
  return showError("Please select a date.");

if (!healthForm.condition.trim())
  return showError("Condition is required.");

if (!healthForm.doctor.trim())
  return showError("Doctor name is required.");

if (healthForm.doctor.trim().length < 3)
  return showError("Doctor name is too short.");

if (!healthForm.notes.trim())
  return showError("Notes are required.");

showSuccess("Health record added!");



    setHealthHistory((p) => [...p, { id: Date.now(), ...healthForm }]);
    setHealthForm({ date: "", condition: "", doctor: "", notes: "" });
    showSuccess("Health record added!");
  };

  const addWellnessTip = () => {
  // Title required
  if (!wellnessForm.title.trim())
    return showError("Title is required!");

  if (wellnessForm.title.trim().length < 3)
    return showError("Title is too short!");

  // Description required
  if (!wellnessForm.description.trim())
    return showError("Description is required!");

  if (wellnessForm.description.trim().length < 5)
    return showError("Description must be at least 5 characters!");

  // If valid → save data
  setWellnessTips((p) => [...p, { id: Date.now(), ...wellnessForm }]);

  // Clear fields
  setWellnessForm({ title: "", description: "", icon: "💡" });

  // Success toast
  showSuccess("Wellness tip added!");
};

  const addReminder = () => {
  if (!reminderForm.time || !reminderForm.message)
    return showError("Time & Message required!");

  const newReminder = { 
    id: Date.now(), 
    ...reminderForm, 
    triggered: false 
  };

  // 1️⃣ React state update
  setReminders((prev) => [...prev, newReminder]);

  // 2️⃣ LOCAL STORAGE UPDATE (GLOBAL REMINDER LISTENER will read this)
  const existing = JSON.parse(localStorage.getItem("reminders") || "[]");
  localStorage.setItem("reminders", JSON.stringify([...existing, newReminder]));

  // reset inputs
  setReminderForm({ time: "", message: "" });

  showSuccess("Reminder added!");
};


  // =============================
  // UI START
  // =============================
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* ================= HEART RATE ================= */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* HEART RATE */}
            <Card className="bg-white rounded-xl border border-gray-300"
>

              <CardHeader className="pt-3">
  <CardTitle className="flex items-center gap-3 text-[22px] font-semibold leading-none pl-2">
    <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-[2px]" />
    <span>Heart Rate</span>
  </CardTitle>
</CardHeader>

              <CardContent className="mt-3">

                <Input
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="Enter BPM"
                />
                <Button className="w-full mt-2" onClick={addHeartRate}>
                  Save
                </Button>

                <div className="mt-3 space-y-1">
                  {heartRateHistory.map((hr, i) => (
                    <div key={i} className="border p-2 rounded flex justify-between">
                      <span>{hr.value} BPM ({hr.date})</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setHeartRateHistory((p) => p.filter((_, idx) => idx !== i));
                          showWarning("Heart Rate removed!");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* STEPS */}
            <Card className="bg-white rounded-xl border border-gray-300"
>

             <CardHeader className="pt-3">

                <CardTitle className="flex items-center gap-3 text-[22px] font-semibold leading-none pl-2">

                  <TrendingUp className="w-5 h-5 text-blue-500" /> Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-3">

                <Input
                  value={stepsToday}
                  onChange={(e) => setStepsToday(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="Enter Steps"
                />
                <Button className="w-full mt-2" onClick={addSteps}>
                  Save
                </Button>

                <div className="mt-3 space-y-1">
                  {stepsHistory.map((s, i) => (
                    <div key={i} className="border p-2 rounded flex justify-between">
                      <span>{s.value} steps ({s.date})</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setStepsHistory((p) => p.filter((_, idx) => idx !== i));
                          showWarning("Steps removed!");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* BLOOD PRESSURE */}
            <Card className="bg-white rounded-xl border border-gray-300"
>

              <CardHeader className="pt-3">

               <CardTitle className="flex items-center gap-3 text-[22px] font-semibold leading-none pl-2">

                  <Activity className="w-5 h-5 text-green-500" /> Blood Pressure
                </CardTitle>
              </CardHeader>
            <CardContent className="mt-3">

                <Input
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="Enter BP"
                />
                <Button className="w-full mt-2" onClick={addBP}>
                  Save
                </Button>

                <div className="mt-3 space-y-1">
                  {bpHistory.map((bp, i) => (
                    <div key={i} className="border p-2 rounded flex justify-between">
                      <span>{bp.value} ({bp.date})</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setBpHistory((p) => p.filter((_, idx) => idx !== i));
                          showWarning("Blood Pressure removed!");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ================= TABS ================= */}
        <Tabs 
  defaultValue="health" 
  className="space-y-6 bg-[#f8fafc] p-6 rounded-2xl border border-gray-300"
>



            {/* ---------- SLIDING TAB BUTTONS GROUP ---------- */}
{/* Beautiful Gradient Tabs Like Mental Health Button */}
<div className="relative w-full h-14 rounded-full bg-[#e5e7eb] p-1 flex items-center shadow-inner">

  {/* Sliding Gradient Pill */}
  <div
    className={`absolute h-12 rounded-full shadow-md transition-all duration-500 ease-in-out
      ${activeTab === "health" ? "left-1 w-[calc(50%-4px)]" : "left-[50%] w-[calc(50%-4px)]"}
      bg-gradient-to-r from-[#1e88ff] to-[#3aa0ff]`}
  />

  {/* Text Buttons */}
  <button
    onClick={() => setActiveTab("health")}
    className={`relative z-10 w-1/2 text-center font-semibold transition-all tracking-wide
      ${activeTab === "health" ? "text-white" : "text-gray-600"}`}
  >
    Health History
  </button>

  <button
    onClick={() => setActiveTab("wellness")}
    className={`relative z-10 w-1/2 text-center font-semibold transition-all tracking-wide
      ${activeTab === "wellness" ? "text-white" : "text-gray-600"}`}
  >
    Wellness Tips
  </button>
</div>



            {/* HEALTH SECTION */}
            <TabsContent value="health">
              <Label>Date</Label>
              <Input
                type="date"
                value={healthForm.date}
                onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })}
              />

              <Label>Condition</Label>
              <Input
                value={healthForm.condition}
                onChange={(e) => setHealthForm({ ...healthForm, condition: e.target.value })}
              />

              <Label>Doctor</Label>
              <Input
                value={healthForm.doctor}
                onChange={(e) => setHealthForm({ ...healthForm, doctor: e.target.value })}
              />

              <Label>Notes</Label>
              <Textarea
                value={healthForm.notes}
                onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
              />

              <Button className="mt-3" onClick={addHealthRecord}>
                Add Record
              </Button>

              <div className="mt-4 space-y-1">
                {healthHistory.map((h) => (
                  <div key={h.id} className="border p-2 rounded flex justify-between">
                    <span>{h.date} — {h.condition} (Dr. {h.doctor})</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setHealthHistory((p) => p.filter((x) => x.id !== h.id));
                        showWarning("Health Record removed!");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* WELLNESS SECTION */}
            <TabsContent value="wellness">
              <Label>Title</Label>
              <Input
                value={wellnessForm.title}
                onChange={(e) => setWellnessForm({ ...wellnessForm, title: e.target.value })}
              />

              <Label>Description</Label>
              <Textarea
                value={wellnessForm.description}
                onChange={(e) => setWellnessForm({ ...wellnessForm, description: e.target.value })}
              />

              <Button className="mt-3" onClick={addWellnessTip}>
                Add Tip
              </Button>

              <div className="mt-4 space-y-1">
                {wellnessTips.map((w) => (
                  <div key={w.id} className="border p-2 rounded flex justify-between">
                    <span>{w.icon} {w.title} — {w.description}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setWellnessTips((p) => p.filter((x) => x.id !== w.id));
                        showWarning("Wellness Tip removed!");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* ================= REMINDERS ================= */}
         <Card className="bg-white rounded-xl border border-gray-300"
>

            <CardHeader className="pt-3">

              <CardTitle className="flex items-center gap-3 text-[22px] font-semibold leading-none pl-2">

                <Bell className="w-5 h-5" /> Reminders
              </CardTitle>
            </CardHeader>

            <CardContent className="mt-3">

              <Label>Message</Label>
              <Input
                value={reminderForm.message}
                onChange={(e) =>
                  setReminderForm({ ...reminderForm, message: e.target.value })
                }
              />

              <Label>Time</Label>
              <Input
                type="time"
                value={reminderForm.time}
                onChange={(e) =>
                  setReminderForm({ ...reminderForm, time: e.target.value })
                }
              />

              <Button className="mt-3" onClick={addReminder}>
                Add Reminder
              </Button>

              <div className="mt-4 space-y-1">
                {reminders.map((r) => (
                  <div key={r.id} className="border p-2 rounded flex justify-between">
                    <span>{r.time} — {r.message}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setReminders((prev) => prev.filter((x) => x.id !== r.id));
                        showWarning("Reminder removed!");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  );
};

export default Dashboard;
