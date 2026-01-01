import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Heart,
  LogOut,
  LayoutDashboard,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import GlobalReminderListener from "@/components/GlobalReminderListener";

import { toast } from "sonner";

const API = "http://localhost:5000";

const Navigation = () => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);
const [dots, setDots] = useState("");
  const [oldImage, setOldImage] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", password: "" });

  const dropdownRef = useRef(null);
  const location = useLocation();
  
  const navigate = useNavigate();
useEffect(() => {
  const checkLogin = () => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      loadProfileFromBackend();
    } else {
      setIsLoggedIn(false);
      setLoadingProfile(false);
    }
  };

  checkLogin(); // initial load

  window.addEventListener("storage", checkLogin);

  return () => {
    window.removeEventListener("storage", checkLogin);
  };
}, []);
useEffect(() => {
  if (!loggingOut) return;

  const interval = setInterval(() => {
    setDots((prev) => (prev.length === 3 ? "" : prev + "."));
  }, 400);

  return () => clearInterval(interval);
}, [loggingOut]);

useEffect(() => {
  if (!loggingOut) return;

  const timer = setTimeout(() => {
    handleLogout();
    setIsOpen(false);
  }, 2700);

  return () => clearTimeout(timer);
}, [loggingOut]);

useEffect(() => {
  const handleLogin = () => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      setUserEmail(email);
      loadProfileFromBackend(); // 🔥 profile reload
    }
  };

  window.addEventListener("user-logged-in", handleLogin);

  return () => {
    window.removeEventListener("user-logged-in", handleLogin);
  };
}, []);




  // -------------------------------------------
  // 1️⃣ FETCH PROFILE FROM BACKEND ALWAYS (NO LOCALSTORAGE IMAGE)
  // -------------------------------------------
  const loadProfileFromBackend = async () => {
  const storedEmail = localStorage.getItem("userEmail");

  // 🔥 IMPORTANT: no email → stop loading
  if (!storedEmail) {
    setLoadingProfile(false);
    return;
  }

  try {
    const res = await fetch(`${API}/api/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: storedEmail }),
    });

    if (!res.ok) return;

    const data = await res.json();

    setUserName(data.full_name);
    setUserEmail(data.email);

    if (data.profile_image) {
      const filename = data.profile_image.split("/uploads/")[1];
      setUserImage(filename);
    } else {
      setUserImage(null);
    }

    setForm({ full_name: data.full_name, password: "" });
  } catch (e) {
    console.log("Profile load error:", e);
  } finally {
    setLoadingProfile(false); // 🔥 MUST BE HERE
  }
};

  // -------------------------------------------
  // 2️⃣ CLOSE DROPDOWN ON OUTSIDE CLICK
  // -------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------
  // 3️⃣ IMAGE UPLOAD (BACKEND ONLY)
  // -------------------------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);
    fd.append("email", userEmail);

    const res = await fetch(`${API}/api/upload-profile-image`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Profile photo updated!");
      setUserImage(data.filename); // backend filename
    } else {
      toast.error("Failed to upload photo");
    }
  };

  // -------------------------------------------
  // 4️⃣ DELETE BACKEND PROFILE IMAGE
  // -------------------------------------------
  const handleDeleteImage = async () => {
    if (!userImage) return;

    const res = await fetch(`${API}/api/delete-profile-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        filename: userImage,
      }),
    });

    if (res.ok) {
      toast.success("Profile photo removed!");
      setUserImage(null);
    } else {
      toast.error("Failed to delete photo");
    }
  };

  // -------------------------------------------
  // 5️⃣ UPDATE PROFILE (NAME + PASSWORD)
  // -------------------------------------------
  const handleEditChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    if (!form.full_name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    setLoading(true);

    const res = await fetch(`${API}/api/update-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        full_name: form.full_name,
        password: form.password || null,
        profile_image: userImage || null,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Profile updated!");
      setUserName(form.full_name);
      setShowEditModal(false);
      setForm({ ...form, password: "" });
    } else {
      toast.error(data.message || "Update failed");
    }

    setLoading(false);
  };

  // -------------------------------------------
  // 6️⃣ LOGOUT
  // -------------------------------------------
  const handleLogout = () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userImage");

  setUserName("");
  setUserEmail("");
  setUserImage(null);

  navigate("/", { replace: true });
  toast.success("Logged out!");
};


  // -------------------------------------------
  // 7️⃣ BACKEND IMAGE SOURCE
  // -------------------------------------------
  const profileImgSrc = userImage
    ? `${API}/uploads/${userImage}`
    : "/default-user.svg";

  // -------------------------------------------
  //  🔥 STOP HERE — DO NOT COPY RETURN BELOW THIS
  // -------------------------------------------



  const navLinks = [
  { name: "Home", path: "/" },
  { name: "Health Check", path: "/health-checker" },
  { name: "Find Doctors", path: "/doctors" },
  { name: "Mental Health", path: "/mental-health" },
  { name: "Emergency", path: "/emergency" },
  { name: "Blog", path: "/blog" },
];

  const hideNav = location.pathname === "/auth";


  const isActive = (path) => location.pathname === path;

  return (
    <>
     <GlobalReminderListener />
      {/* ================= Navbar ================= */}
      {/* 🌟 MOBILE MENU (Android / Mobile) */}
{/* 🌟 MOBILE MENU */}
{isOpen && (
  <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-[9999] p-4 space-y-3">

    {navLinks.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        onClick={() => setIsOpen(false)}
        className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-muted transition"
      >
        {link.name}
      </Link>
    ))}

    {/* Login / Profile in Mobile */}
    {!userName ? (
      <Button
        onClick={() => {
          setIsOpen(false);
          navigate("/auth");
        }}
        className="w-full gradient-hero text-white shadow-soft mt-3"
      >
        Login / Sign Up
      </Button>
    ) : (
      <div className="mt-4 border-t pt-4">
        <button
          onClick={() => {
            setIsOpen(false);
            navigate("/dashboard");
          }}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Dashboard
        </button>

        <button
          onClick={() => {
            setIsOpen(false);
            setLoggingOut(true);
          }}
          disabled={loggingOut}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm w-full disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          {loggingOut ? `Signing out${dots}` : "Sign out"}
        </button>
      </div>
    )}

  </div>
)}


      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16 relative">

      {/* 🔹 Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-glow transition-smooth">
          <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Medisynn
        </span>
      </Link>

      {/* 🔹 Center Nav Links (Perfectly Centered) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-6">
  {navLinks.map((link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-medium transition-smooth ${
        isActive(link.path)
          ? "bg-primary text-white shadow-soft"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {link.name}
    </Link>
  ))}
</div>


      {/* 🔹 Profile / Login Section (Right Side) */}
<div className="flex items-center gap-3 relative" ref={dropdownRef}>

  {/* 🔥 1) If on AUTH → hide everything */}
  {location.pathname === "/auth" ? null : (
    <>
      {/* 🔥 2) If NOT logged in → show Login Button immediately */}
   {!loadingProfile && userName === "" && (
  <Button
    onClick={() => navigate("/auth")}
    className="hidden md:inline-flex gradient-hero text-primary-foreground shadow-soft hover:shadow-glow transition-smooth"
  >
    Login / Sign Up
  </Button>
)}




      {/* 🔥 3) If logged in → wait until loading finishes */}
      {userName && !loadingProfile && (
        <>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <img
              src={
                userImage
                  ? `http://localhost:5000/uploads/${userImage}`
                  : "/default-user.svg"
              }
              alt="Profile"
              className="w-12 h-12 rounded-full border border-gray-300 object-cover"
              onError={(e) => (e.currentTarget.src = "/default-user.svg")}
            />
            <span className="font-medium text-foreground">{userName}</span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-[115%] right-[-20px] bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-44 z-50 animate-fade-in-smooth"
              style={{ transformOrigin: "top right", transition: "all 0.2s ease" }}
            >
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                onClick={() => setDropdownOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" /> Dashboard
              </Link>

              <button
                onClick={() => {
                  setOldImage(userImage);
                  setForm({ full_name: userName, password: "" });
                  setShowEditModal(true);
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 w-full text-left"
              >
                <Edit3 className="w-4 h-4 text-gray-500" /> Edit Profile
              </button>

             <button
  onClick={() => setLoggingOut(true)}
  disabled={loggingOut}
  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm w-full disabled:opacity-50"
>
  <LogOut className="w-4 h-4 text-red-500" />
  {loggingOut ? `Signing out${dots}` : "Sign out"}
</button>



            </div>
          )}
        </>
      )}
    </>
  )}

</div>



      {/* 🔹 Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  </div>
</nav>


      {/* ================= Edit Profile Modal ================= */}
      {showEditModal && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-3">

<Card className="w-full max-w-md md:max-w-md max-h-[85vh] bg-white shadow-2xl rounded-2xl animate-scale-in border border-gray-100">


         <CardContent className="p-4 md:p-8 space-y-4">

              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Edit Profile
              </h3>

              {/* 🧑 Profile Image Section */}
{/* 🧑 Profile Image Section */}
<div className="flex flex-col items-center gap-3">

  {/* Profile Photo */}
  <div className="relative group">
    
    
    <img
  src={
    userImage
      ? `http://localhost:5000/uploads/${userImage}`
      : "/default-user.svg"
  }
  alt="Profile"
  className="w-24 h-24 rounded-full border border-gray-300 object-cover"
  onError={(e) => (e.currentTarget.src = "/default-user.svg")}
/>


  </div>

  {/* Change Photo */}
<div className="flex flex-col items-center">
  <label
    htmlFor="profileImage"
    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-all"
  >
    {userImage ? "Change Photo" : "Add Photo"}
  </label>

  <input
    id="profileImage"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("image", file);
      fd.append("email", userEmail);

      const uploadRes = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: fd,
      });

      const data = await uploadRes.json();

      if (uploadRes.ok) {
        toast.success("Profile photo updated!");
        setUserImage(data.filename);
          console.log("🚀 Dispatching update from Navigation (UPLOAD)");
        window.dispatchEvent(new Event("profile-image-updated"));

      } else {
        toast.error("Failed to upload image.");
      }
    }}
  />
</div>


  {/* Delete Photo */}
  {userImage && userImage !== "/default-user.svg" && (
  <button
    type="button"
    onClick={async () => {
      const res = await fetch("/api/delete-profile-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          filename: userImage,
        }),
      });

      if (res.ok) {
        toast.success("Profile photo removed!");
        setUserImage(null);

        localStorage.removeItem("userImage");

        // 🔥 ADD THIS LINE  
          console.log("🗑️ Dispatching update from Navigation (DELETE)");
        window.dispatchEvent(new Event("profile-image-updated"));
      } else {
        toast.error("Failed to delete image.");
      }
    }}
    className="text-red-600 text-sm font-semibold underline -mt-5"

  >
    Delete Photo
  </button>
)}


</div>


              {/* ✏️ Edit Info Section */}
              <div className="space-y-3 mt-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleEditChange}
                    placeholder="Enter your full name"
                    className="mt-1 focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={userEmail}
                    disabled
                    className="mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">New Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleEditChange}
                    placeholder="Enter new password"
                    className="mt-1 focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* ✅ Buttons */}
              <div className="flex justify-end gap-3 pt-6">
                <Button
  variant="outline"
  onClick={() => {
    setShowEditModal(false);

    // RESET FORM to old values
    setForm({
      full_name: userName,
      password: "",
    });

    // 🔥 Only restore old image if editing ka time change hua
    if (oldImage !== userImage) {
      setUserImage(oldImage);
    }
  }}
  className="border-2 hover:transition-smooth"
>
  Cancel
</Button>


                <Button
                  onClick={handleProfileUpdate}
                  className="px-4 py-2 gradient-hero text-white shadow-md hover:shadow-glow transition-all"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Navigation;
