import { Heart, Mail, Phone, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [animateOutPrivacy, setAnimateOutPrivacy] = useState(false);
  const [animateOutHelp, setAnimateOutHelp] = useState(false);

  const closePrivacy = () => {
    setAnimateOutPrivacy(true);
    setTimeout(() => {
      setPrivacyOpen(false);
      setAnimateOutPrivacy(false);
    }, 300);
  };

  const closeHelp = () => {
    setAnimateOutHelp(true);
    setTimeout(() => {
      setHelpOpen(false);
      setAnimateOutHelp(false);
    }, 300);
  };

  return (
    <>
      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                  <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Medisynn
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered health companion for a better tomorrow.
              </p>
            </div>

            {/* Quick Links */}
            <div>
  <h3 className="font-semibold mb-4">Quick Links</h3>
  <ul className="space-y-2 text-sm">
    <li>
      <Link
        to="/health-checker"
        className="text-muted-foreground hover:text-primary transition-smooth"
      >
        Health Check
      </Link>
    </li>

    <li>
      <Link
        to="/doctors"
        className="text-muted-foreground hover:text-primary transition-smooth"
      >
        Find Doctors
      </Link>
    </li>

    <li>
      <Link
        to="/mental-health"
        className="text-muted-foreground hover:text-primary transition-smooth"
      >
        Mental Health
      </Link>
    </li>

    <li>
      <Link
        to="/emergency"
        className="text-muted-foreground hover:text-primary transition-smooth"
      >
        Emergency
      </Link>
    </li>

    <li>
      <Link
        to="/blog"
        className="text-muted-foreground hover:text-primary transition-smooth"
      >
        Health Blog
      </Link>
    </li>
  </ul>
</div>


            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  medisynn.care24@gmail.com
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  +91 7505041335, +91 9569431713, +91 9996714303
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  Rajpura, Punjab
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Medisynn. All rights reserved.
            </p>
          </div>
        </div>

        {/* ================= Custom Popups ================= */}
        {/* Help Center Popup */}
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className={`bg-card max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-xl relative ${
                animateOutHelp ? "animate-scale-out" : "animate-scale-in"
              }`}
            >
              <Button
                onClick={closeHelp}
                className="absolute top-4 right-4 p-1 rounded-full bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent shadow-none"
              >
                <X className="w-5 h-5 text-black" />
              </Button>
              <h2 className="text-lg font-bold mb-4">Help Center</h2>
              <p>Welcome to Medisynn Help Center.</p>
              <p>Here are some common questions and answers:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong>How do I find a doctor?</strong> Go to the 'Find Doctors' page and search for nearby hosptials.</li>
                <li><strong>Is my health data safe?</strong> Yes, all your data is encrypted and private.</li>
                <li><strong>How to use AI Health Checker?</strong> Enter your symptoms and follow the instructions.</li>
                <li><strong>Can I edit my profile?</strong> Yes, go to 'My Dashboard' to edit your profile details.</li>
              </ul>
              <p>If you need further help, contact us at <strong>medisynn560@gmail.com</strong>.</p>
            </div>
          </div>
        )}

        {/* Privacy Policy Popup */}
        {privacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className={`bg-card max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-xl relative ${
                animateOutPrivacy ? "animate-scale-out" : "animate-scale-in"
              }`}
            >
              <Button
                onClick={closePrivacy}
                className="absolute top-4 right-4 p-1 rounded-full bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent shadow-none"
              >
                <X className="w-5 h-5 text-black" />
              </Button>
              <h2 className="text-lg font-bold mb-4">Privacy Policy</h2>
              <div className="text-sm text-muted-foreground space-y-4">
                <p>
                  Welcome to Medisynn. Your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>
                <h4 className="font-semibold">1. Information We Collect</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Personal information such as name, email, and phone.</li>
                  <li>Health-related information from AI assessments.</li>
                  <li>Usage data of our platform.</li>
                </ul>
                <h4 className="font-semibold">2. How We Use Your Information</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Provide AI-driven health insights.</li>
                  <li>Manage doctor accounts and appointments.</li>
                  <li>Improve services and features.</li>
                </ul>
                <h4 className="font-semibold">3. Data Security</h4>
                <p>We encrypt sensitive data both in transit and at rest.</p>
                <h4 className="font-semibold">4. Sharing of Information</h4>
                <p>We never sell your data. Only trusted providers for functionality.</p>
                <h4 className="font-semibold">5. User Rights</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Access, update, or delete personal info.</li>
                  <li>Opt-out of marketing communications.</li>
                  <li>Request copy of health data.</li>
                </ul>
                <h4 className="font-semibold">6. Children’s Privacy</h4>
                <p>Not for children under 13. No data collected knowingly.</p>
                <h4 className="font-semibold">7. Changes to Policy</h4>
                <p>Updates will be posted on this page with date.</p>
                <h4 className="font-semibold">8. Contact Us</h4>
                <p>Email: <strong>medisynn560@gmail.com</strong></p>
              </div>
            </div>
          </div>
        )}
      </footer>

      {/* ================= Animations (Tailwind classes) ================= */}
      <style>
        {`
          @keyframes scale-in {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes scale-out {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0; }
          }
          .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
          .animate-scale-out { animation: scale-out 0.2s ease-in forwards; }
        `}
      </style>
    </>
  );
};

export default Footer;
