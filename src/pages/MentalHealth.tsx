import React, { useEffect, useState } from "react";
import { Heart, Smile, Frown, BookOpen, Info, SunMedium } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import mentalHealthImage from "@/assets/mental-health.jpg";

export default function MentalHealthAnimated() {
  // Core states
  const [selectedMood, setSelectedMood] = useState(null);
  const [stress, setStress] = useState(0);

  const [dailyTip, setDailyTip] = useState("");
  const [activeThought, setActiveThought] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0); // 0 idle, 1 inhale, 2 hold, 3 exhale

  const wellnessTips = [
  "Take 5 deep breaths to reset your mind.",
  "Drink a glass of water and relax your shoulders.",
  "Go for a 5-minute walk to refresh your thoughts.",
  "Reduce screen brightness to relax your eyes.",
  "Practice gratitude — think of one good thing today.",
  "Stretch your arms and back for 20 seconds.",
  "Splash cool water on your face to refresh your mind.",
  "Step outside and get sunlight for 2 minutes.",
  "Sit upright and take 3 slow breaths.",
  "Listen to your favorite calming music for 1 minute.",
  "Close your eyes and notice 3 things around you.",
  "Relax your jaw — unclench slowly.",
  "Roll your shoulders back gently.",
  "Think of someone you care about.",
  "Smile softly — even forced smiles release tension.",
  "Write one positive sentence about today.",
  "Avoid screens for 2 minutes and let your eyes rest.",
  "Drink warm water or tea to soothe your body.",
  "Take 10 calm steps focusing on your breath.",
  "Organize one small thing around you.",
  "Keep your phone away for a short moment.",
  "Take a slow deep breath through the nose and exhale through the mouth.",
  "Look at the sky and breathe slowly.",
  "Say to yourself: ‘I am safe. I am okay.’",
  "Loosen your neck muscles with gentle circles.",
  "Lightly massage your temples.",
  "Think of one thing that made you smile this week.",
  "Take a mindful pause — do nothing for 15 seconds.",
  "Drink a sip of water mindfully.",
  "Place your hand on your chest and feel your breathing.",
  "Do a quick body scan from head to toe.",
  "Let go of one small worry for now.",
  "Count backward from 10 while breathing calmly.",
  "Put your feet flat on the ground and feel the support.",
  "Adjust your posture to sit comfortably.",
  "Clean a small area like your desk corner.",
  "Plan one small thing you’ll enjoy today.",
  "Limit negative thoughts by focusing on your breath.",
  "Say: 'I choose peace for the next moment.’",
  "Stretch your fingers and wrists.",
  "Take a fresh air break — open a window briefly.",
  "Do a 10-second mindfulness pause.",
  "Notice one sound around you without reacting.",
  "Take a slow breath and relax your stomach muscles.",
  "Release tension from your brow by softening it.",
  "Think of a calm place — beach, forest, room.",
  "Drink a full glass of water slowly.",
  "Rest your eyes by looking at something far away.",
  "Say one kind thing about yourself.",
  "Let your shoulders drop naturally.",
  "Walk slowly for 30 seconds mindfully.",
  "Lightly tap your chest center to relieve stress.",
  "Imagine a warm light surrounding you.",
  "Visualize exhaling all stress out of your body.",
  "Sit silently for a few seconds and breathe.",
  "Pause and observe any tightness — soften it.",
  "Thank your body for supporting you today.",
  "Unplug from social media for a short moment.",
  "Do nothing for 30 calm seconds.",
  "Imagine your happiest memory for 10 seconds.",
  "Remember: It’s okay to slow down."
];


  const meditations = [
    {
      title: "Morning Mindfulness",
      category: "Beginner",
      thought: "Take a deep breath and imagine sunlight entering your mind. Start gently.",
    },
    {
      title: "Stress Relief",
      category: "Intermediate",
      thought: "Relax your shoulders and jaw. Imagine stress melting away with each breath.",
    },
    {
      title: "Deep Sleep Prep",
      category: "Advanced",
      thought: "Picture a safe, dark sky. Let your thoughts float by like clouds.",
    },
    {
      title: "Anxiety Calming",
      category: "Beginner",
      thought: "Repeat softly: I am safe. I am calm. This feeling will pass.",
    },
  ];

  useEffect(() => {
    const r = Math.floor(Math.random() * wellnessTips.length);
    setDailyTip(wellnessTips[r]);
  }, []);

  // Modal helpers
  const openThought = (thought) => {
    setActiveThought(thought);
    setModalVisible(false);
    setTimeout(() => setModalVisible(true), 20);
  };
  const closeThought = () => {
    setModalVisible(false);
    setTimeout(() => setActiveThought(null), 300);
  };

  // Breathing guidance animation (visual, accessible)
  useEffect(() => {
    let timer;
    if (breathPhase === 0) return;

    if (breathPhase === 1) timer = window.setTimeout(() => setBreathPhase(2), 4000); // inhale 4s
    if (breathPhase === 2) timer = window.setTimeout(() => setBreathPhase(3), 2000); // hold 2s
    if (breathPhase === 3) timer = window.setTimeout(() => setBreathPhase(0), 4000); // exhale 4s

    return () => timer && clearTimeout(timer);
  }, [breathPhase]);

  const startBreathing = () => setBreathPhase(1);
  const stopBreathing = () => setBreathPhase(0);

  const getStressMessage = (value) => {
    if (value <= 20) return "You seem calm.";
    if (value <= 40) return "Mild stress — take a short break.";
    if (value <= 70) return "Moderate stress — try 3 deep breaths.";
    if (value <= 90) return "High stress — pause and rest.";
    return "Very high stress — consider seeking support.";
  };

  // Mood options (Option C: white card + colored border/icon/text)
  const moodOptions = [
    { label: "Happy", icon: Smile, color: "green" },
    { label: "Neutral", icon: SunMedium, color: "orange" },
    { label: "Sad", icon: Frown, color: "red" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="mb-8 rounded-3xl overflow-hidden shadow-lg animate-hero-fade">
            <img src={mentalHealthImage} alt="Wellness" className="w-full h-64 object-cover" />
            <div className="-mt-20 p-6 sm:p-8 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm">
              <h1 className="text-3xl sm:text-4xl font-semibold">Mental Wellness Tools</h1>
              <p className="mt-2 text-slate-600">Helpful interactive tools — simple, safe, and focused.</p>
            </div>
          </section>

          {/* Grid: Balanced layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left column: Mood + Stress + Tip */}
            <div className="flex flex-col justify-start space-y-12 lg:col-span-1">
              {/* MOOD TRACKER */}
              <Card className="p-0 overflow-hidden shadow-md animate-card-up">
             <CardHeader className="p-0">
  <div className="rounded-t-2xl px-6 py-4 bg-gradient-to-r from-[#2196f3] to-[#26d0ce] text-white">
    <CardTitle className="text-white flex items-center gap-2">
      {/* ICON HERE */}
      Mood Tracker
    </CardTitle>
  </div>
</CardHeader>

             <CardContent className="px-6 py-6">


                  <div className="flex gap-4 justify-between my-6">

                    {moodOptions.map((m) => {
                      const Icon = m.icon;
                      const active = selectedMood === m.label;

                      // classes derived to avoid inline nested ternary errors
                      const baseBtnClasses =
                        "flex-1 rounded-lg py-4 px-3 flex flex-col items-center gap-2 transition-all duration-200 bg-white";
                      const activeBorderClass =
                        m.color === "green"
                          ? "border-2 border-green-500 scale-105 shadow-md"
                          : m.color === "orange"
                          ? "border-2 border-orange-400 scale-105 shadow-md"
                          : "border-2 border-red-500 scale-105 shadow-md";
                      const inactiveBorderClass = "border-2 border-slate-200 hover:border-slate-300";
                      const iconColorClass = active
                        ? m.color === "green"
                          ? "text-green-600"
                          : m.color === "orange"
                          ? "text-orange-500"
                          : "text-red-600"
                        : "text-slate-500";
                      const textColorClass = active
                        ? m.color === "green"
                          ? "font-medium text-green-700"
                          : m.color === "orange"
                          ? "font-medium text-orange-600"
                          : "font-medium text-red-700"
                        : "text-slate-700";

                      return (
                        <button
                          key={m.label}
                          onClick={() => setSelectedMood(m.label)}
                          className={`${baseBtnClasses} ${active ? activeBorderClass : inactiveBorderClass}`}
                        >
                          <Icon className={`w-7 h-7 ${iconColorClass}`} />
                          <span className={`text-sm ${textColorClass}`}>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedMood && (
                    <div className="mt-2 text-sm text-slate-600 animate-fade-in">
                      <strong className="block mb-1">Tip:</strong>
                      {selectedMood === "Happy" && <p>Keep doing activities that support this mood.</p>}
                      {selectedMood === "Neutral" && <p>Try a short breathing break to energize.</p>}
                      {selectedMood === "Sad" && <p>It's okay to rest. Try a grounding exercise for 2 minutes.</p>}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* STRESS METER (height balanced) */}
<Card className="p-0 shadow-md animate-card-up h-full rounded-2xl overflow-hidden">

  <CardHeader className="p-0">
    <div className="rounded-t-2xl px-6 py-4 bg-gradient-to-r from-[#2196f3] to-[#26d0ce]">
      <CardTitle className="text-white">Stress Meter</CardTitle>
    </div>
  </CardHeader>

  <CardContent className="px-6 py-6">

    <input
      type="range"
      min={0}
      max={100}
      value={stress}
      onChange={(e) => setStress(Number(e.target.value))}
      className="w-full h-2 accent-rose-600"
    />

    <div className="flex justify-between text-xs text-slate-500 mt-3">
      <span>Relaxed</span>
      <span>Light</span>
      <span>Moderate</span>
      <span>High</span>
      <span>Very High</span>
    </div>

    <p className="mt-3 text-sm text-slate-700">{getStressMessage(stress)}</p>
  </CardContent>
</Card>


              {/* DAILY TIP (height balanced) */}
              <Card className="p-0 shadow-md animate-card-up rounded-2xl">
  <CardHeader className="p-0">
    <div className="rounded-t-2xl px-6 py-4 bg-gradient-to-r from-[#2196f3] to-[#26d0ce] text-white">
      <CardTitle className="text-white">Daily Wellness Tip</CardTitle>
    </div>
  </CardHeader>

  <CardContent className="px-5 py-4">
    <p className="text-sm text-slate-700">{dailyTip}</p>
  </CardContent>
</Card>

            </div>

            {/* Middle+Right column: Breathing + Guided + Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Breathing Exercise */}
              <Card className="p-0 shadow-md animate-card-up rounded-2xl overflow-hidden bg-gradient-to-r from-[#2196f3] to-[#26d0ce]">
  <div className="px-6 py-4">
    <h2 className="text-white text-xl font-semibold">Breathing Support</h2>
  </div>

  <CardContent className="backdrop-blur-sm bg-white/70 px-6 py-6 rounded-b-2xl">
    <div className="flex flex-col lg:flex-row gap-10 items-center">

      <div className="flex-1">
        <h3 className="font-medium text-slate-900">4 — 2 — 4 Breathing</h3>
        <p className="text-sm text-slate-700 mt-2">Follow the visual guide and breathe with the cycle. Start when you're ready.</p>

        <div className="flex gap-3 mt-4">
          <Button onClick={startBreathing}>Start</Button>
          <Button variant="outline" onClick={stopBreathing}>Stop</Button>
        </div>
      </div>

      <div className="flex items-center justify-center w-full lg:w-56">
        <div className="relative">
          <div className={`breath-circle ${breathPhase === 1 ? "inhale" : breathPhase === 2 ? "hold" : breathPhase === 3 ? "exhale" : ""}`}></div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-slate-800">
              {breathPhase === 0 && <p className="text-sm">Idle</p>}
              {breathPhase === 1 && <p className="text-sm text-rose-600">Inhale • 4s</p>}
              {breathPhase === 2 && <p className="text-sm text-amber-600">Hold • 2s</p>}
              {breathPhase === 3 && <p className="text-sm text-sky-600">Exhale • 4s</p>}
            </div>
          </div>
        </div>
      </div>

    </div>
  </CardContent>
</Card>


              {/* Guided Thoughts */}
              <Card className="p-0 shadow-md animate-card-up rounded-2xl overflow-hidden bg-gradient-to-r from-[#2196f3] to-[#26d0ce]">
  <div className="px-6 py-4">
    <h2 className="text-white text-xl font-semibold">Guided Thoughts</h2>
  </div>

  <CardContent className="backdrop-blur-sm bg-white/70 px-6 py-6 rounded-b-2xl">
    <div className="grid md:grid-cols-2 gap-6">
      {meditations.map((m, i) => (
        <button
          key={i}
          onClick={() => openThought(m.thought)}
          className="text-left p-4 border rounded-lg hover:shadow bg-white transition-all"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{m.title}</h4>
            <Badge>{m.category}</Badge>
          </div>

          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{m.thought}</p>
        </button>
      ))}
    </div>
  </CardContent>
</Card>


              {/* Info cards row */}
            
            </div>
          </div>
        </div>
      </main>

      {/* Thought Modal */}
      {activeThought && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity ${modalVisible ? "opacity-100" : "opacity-0"}`}>
          <div className={`bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl transform transition-all ${modalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <button className="absolute top-4 right-4 text-slate-500" onClick={closeThought}>
              ×
            </button>
            <p className="text-slate-800 leading-relaxed">{activeThought}</p>
           
          </div>
        </div>
      )}

      <Footer />

      {/* Inline styles for animations (kept scoped here for portability) */}
      <style>{`
        .card-spacing-fix .card-header {
    padding-top: 22px !important;
    padding-bottom: 14px !important;
  }
        .animate-hero-fade { animation: heroFade 600ms ease forwards; }
        @keyframes heroFade { from { opacity: 0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0);} }

        .animate-card-up { animation: cardUp 500ms ease forwards; }
        .animate-card-up.delay-75 { animation-delay: 75ms; }
        .animate-card-up.delay-100 { animation-delay: 100ms; }
        .animate-card-up.delay-150 { animation-delay: 150ms; }
        @keyframes cardUp { from { opacity: 0; transform: translateY(8px); } to { opacity:1; transform: translateY(0);} }

        .animate-fade-in { animation: fadeIn 350ms ease forwards; }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

       .breath-circle {
  width: 160px;
  height: 160px;
  border-radius: 9999px;
  
  /* Better visibility */
  background: radial-gradient(circle at center,
    rgba(255,255,255,0.8),
    rgba(255,255,255,0.35),
    rgba(0,0,0,0.08)
  );

  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255,255,255,0.5);

  transition: all 400ms ease;
}

/* Animations */
.breath-circle.inhale {
  transform: scale(1.25);
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.25);
}

.breath-circle.hold {
  transform: scale(1.35);
  box-shadow: 0 14px 60px rgba(0, 0, 0, 0.28);
}

.breath-circle.exhale {
  transform: scale(0.9);
  opacity: 0.85;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.18);
}


        @media (max-width: 768px) {
  .breath-circle {
    width: 130px;
    height: 130px;
  }
}

      `}</style>
    </div>
  );
}
