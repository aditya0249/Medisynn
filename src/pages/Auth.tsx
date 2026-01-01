import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import "@/styles/animations.css";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ States
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(15);
const [canResend, setCanResend] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fade, setFade] = useState("animate-fade-in"); // For smooth transitions

  // ✅ Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");

  // ✅ Forgot Password + OTP + Reset
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Handle Signup
  useEffect(() => {
  // Disable scroll on auth page
  document.body.style.overflow = "hidden";

  return () => {
    // Re-enable scroll when leaving auth
    document.body.style.overflow = "auto";
  };
}, []);
  useEffect(() => {
  const savedEmail = localStorage.getItem("remember_email");
  if (savedEmail) {
    setLoginEmail(savedEmail);
    setRememberMe(true);
  }
}, []);

useEffect(() => {
  if (!showOTPInput) return;

  setCanResend(false);
  setResendTimer(15);

  const interval = setInterval(() => {
    setResendTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setCanResend(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [showOTPInput]);
const handleResendOtp = async () => {
  if (!canResend) return;

  try {
    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });

    toast({
      title: "OTP Sent Again",
      description: "A new OTP has been sent to your email.",
      className: "bg-emerald-500 text-white border-none shadow-lg",
    });

    // 🔄 Reset timer
    setCanResend(false);
    setResendTimer(15);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  } catch {
    toast({
      title: "Error",
      description: "Failed to resend OTP.",
      variant: "destructive",
    });
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: signupFullName,
        email: signupEmail,
        password: signupPassword,
      }),
    });

    // 🔴 PEHLE response check
    if (!response.ok) {
      const text = await response.text();

      if (response.status === 409) {
       setTimeout(() => {
         toast({
          title: "User Already Exists",
          description: "This email is already registered. Please log in instead.",
          variant: "destructive",
        });
       }, 1200);
        return;
      }

      throw new Error(text || "Signup failed");
    }

    // 🟢 AB JSON SAFE HAI
    const data = await response.json();
    if (rememberMe) {
  localStorage.setItem("remember_email", loginEmail);
} else {
  localStorage.removeItem("remember_email");
}


    setTimeout(() => {
      toast({
      title: "Account Created!",
      description: data.message || "Your account has been created. Please sign in to continue.",
      className: "bg-emerald-500 text-white border-none shadow-lg",
    });
    setIsLoading(false);
    setActiveTab("login");
    setSignupEmail("");
    setSignupPassword("");
    setSignupFullName("");
    }, 2000);


  } catch (err) {
    toast({
      title: "Network Error",
      description: "Cannot connect to the server.",
      variant: "destructive",
    });
  } 
};


  // ✅ Handle Login
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    if (!response.ok) {
      const text = await response.text();

      if (response.status === 404) {
        setTimeout(() => {
          setIsLoading(false);
           toast({
          title: "User Not Found",
          description: "No account exists with this email. Please sign up first.",
          variant: "destructive",
        });
        }, 1200);
       
           // ✅ IMPORTANT
        return;
      }

      if (response.status === 401) {
        setTimeout(()=>{
          setIsLoading(false);
          toast({
          title: "Invalid Password",
          description: "Your password is incorrect. Try again.",
          variant: "destructive",
        });
        },1200)
        
           // ✅ IMPORTANT
        return;
      }

      throw new Error(text || "Login failed");
    }

    const data = await response.json();

    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userName", data.user.full_name);
    window.dispatchEvent(new Event("user-logged-in"));

    // ⏳ HOLD Processing for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 3000);

  } catch (err) {
    setIsLoading(false);
    toast({
      title: "Server Error",
      description: "Cannot connect to backend.",
      variant: "destructive",
    });
  }
};




  // ✅ Send OTP
const handleSendOtp = async () => {
  if (!resetEmail) {
   setTimeout(() => {
     toast({
      title: "Enter your email",
      description: "Please enter your registered email to get a reset code.",
      variant: "destructive",
    });
   }, 1200);
    return;
  }

  setIsOtpLoading(true);

  try {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });

    // 🔴 PEHLE response check
    if (!res.ok) {
      const text = await res.text();

      if (res.status === 404) {
      setTimeout(() => {
          toast({
          title: "User Not Found",
          description: "No account exists with this email.",
          variant: "destructive",
        });
      }, 1200);
        return;
      }

      throw new Error(text || "Failed to send OTP");
    }

    // 🟢 AB JSON SAFE HAI
    await res.json();

    // ⭐ Delay to show animation properly
    setTimeout(() => {
      toast({
        title: "OTP Sent!",
        description: "Check your inbox for your 6-digit reset code.",
        className: "bg-emerald-500 text-white border-none shadow-lg",
      });

      setShowOTPInput(true);
    }, 2000);

  } catch (err) {
    toast({
      title: "Server Error",
      description: "Cannot reach backend.",
      variant: "destructive",
    });
  } finally {
    // ⭐ Smooth loading ending
    setTimeout(() => {
      setIsOtpLoading(false);
    }, 2000);
  }
};



  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
  if (!otp || otp.length !== 6) {
      toast({
      title: "Invalid OTP",
      description: "Please enter the 6-digit code sent to your email.",
      variant: "destructive",
    });
    setIsLoading(false);
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, otp }),
    });

    // 🔴 PEHLE response check
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "OTP verification failed");
    }

    // 🟢 AB JSON SAFE HAI
    await res.json();

    setTimeout(() => {
      
      toast({
      title: "OTP Verified!",
      description: "Enter your new password.",
      className: "bg-emerald-500 text-white border-none shadow-lg",
    });
    setIsLoading(false);

    setShowResetPassword(true);
    }, 3000);

  } catch (err) {
    setTimeout(() => {
      toast({
      title: "Verification Failed",
      description: "Incorrect or expired OTP.",
      variant: "destructive",
    });
    setIsLoading(false);
    }, 1200);
  } 
};


  // ✅ Reset Password
 const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    toast({
      title: "Missing Fields",
      description: "Please fill both password fields.",
      variant: "destructive",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    toast({
      title: "Password Mismatch",
      description: "Passwords do not match.",
      variant: "destructive",
    });
    return; // ❌ no loading here
  }

  setIsLoading(true); // ✅ ONLY HERE

  try {
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, newPassword }),
    });

    if (!res.ok) throw new Error("Reset failed");

    await res.json();

    setTimeout(() => {
      toast({
        title: "Password Updated!",
        description: "You can now sign in with your new password.",
        className: "bg-emerald-500 text-white border-none shadow-lg",
      });

      setIsLoading(false); // ✅ STOP loading HERE

      setFade("animate-fade-out");
      
        setShowForgotPassword(false);
        setShowOTPInput(false);
        setShowResetPassword(false);
        setOtp("");
        setResetEmail("");
        setFade("animate-fade-in");
      
    }, 3000);

  } catch (err) {
    toast({
      title: "🚨 Server Error",
      description: "Unable to reach backend.",
      variant: "destructive",
    });
    setIsLoading(false); // ✅ STOP on error
  }
};


  // 🌟 RETURN (Animated)
  return (
<div className="fixed inset-0 top-16 bg-[#cfcfcf] flex items-center justify-center px-4">


  



  <Card className="w-full max-w-[400px] max-h-full overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-100 p-6">



       <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-400 text-primary-foreground text-center py-4 rounded-xl mb-3 animate-slide-down">

          <CardTitle className="text-3xl font-bold">Welcome to Medisynn</CardTitle>
          <CardDescription className="text-white/90">
            Your AI-powered health companion
          </CardDescription>
        </CardHeader>

        <CardContent className={`p-6 bg-white rounded-lg overflow-hidden ${fade}`}>
          {!showForgotPassword ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full animate-fade-in-up"
            >
             <TabsList className="relative flex w-full justify-between bg-[#f1f3f5] rounded-full p-1 mb-4 overflow-hidden">

                <div
                  className="absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-all duration-500 ease-in-out"
                  style={{
                    transform:
                      activeTab === "signup" ? "translateX(100%)" : "translateX(0%)",
                  }}
                />
                <TabsTrigger
                  value="login"
                  className={`relative z-10 flex-1 text-center py-2 font-medium rounded-full ${
                    activeTab === "login"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className={`relative z-10 flex-1 text-center py-2 font-medium rounded-full ${
                    activeTab === "signup"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* 🔹 Login */}
              
              <TabsContent value="login" className="animate-fade-in-up">
                <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />

                  <Label>Password</Label>

<div className="relative">
  <Input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter your password"
    value={loginPassword}
    onChange={(e) => setLoginPassword(e.target.value)}
    required
    className="pr-10"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
    aria-label="Toggle password visibility"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
<div className="flex items-center justify-between mt-2">
  {/* Remember Me */}
  <label className="flex items-center gap-2 text-sm cursor-pointer">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="accent-blue-500 w-4 h-4"
    />
    Remember me
  </label>

  {/* Forgot Password */}
  <button
    type="button"
    onClick={() => {
      setFade("animate-fade-out");
      setTimeout(() => {
        setShowForgotPassword(true);
        setFade("animate-fade-in");
      }, 400);
    }}
className="text-sm text-muted-foreground hover:text-primary transition-all relative -top-[6.5px]"

  >
    Forgot your password?
  </button>
</div>


                  <button
  type="submit"
  disabled={isLoading}
  className={`w-full gradient-hero text-white flex items-center justify-center gap-2 py-3 rounded-lg transition-all
    ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"}`}
>
  {isLoading ? (
    <span className="flex items-center">
  Processing<span className="dots"></span>
</span>

  ) : (
    "Sign In"
  )}
</button>


                </form>
              </TabsContent>

              {/* 🔹 Signup */}
              <TabsContent value="signup" className="animate-fade-in-up">
                <form onSubmit={handleSignup} className="space-y-4">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                  />
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                  <Label>Password</Label>
                 <div className="relative">
  <Input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={signupPassword}
    onChange={(e) => setSignupPassword(e.target.value)}
    required
    className="pr-10"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

                  <div className={isLoading ? "cursor-not-allowed" : ""}>
  <Button
    type="submit"
    disabled={isLoading}
    className="w-full gradient-hero text-white transition-all"
  >
    {isLoading ? (
      <span className="flex items-center justify-center">
        Creating<span className="create-dots"></span>
      </span>
    ) : (
      "Create Account"
    )}
  </Button>
</div>

                </form>
              </TabsContent>
            </Tabs>
          ) : (
            // 🔹 Forgot Password Section (Animated)
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-lg font-semibold text-center">Reset Your Password</h3>

              {!showOTPInput && !showResetPassword && (
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your registered email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                 <div style={{ marginTop: "18px" }}>
  <button
    onClick={handleSendOtp}
    disabled={isOtpLoading}
    className={`w-full gradient-hero text-white flex items-center justify-center py-3 rounded-lg transition-all
      ${isOtpLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"}`}
  >
    {isOtpLoading ? (
      <span className="flex items-center">
        <span>Sending</span><span className="dots"></span>
      </span>
    ) : (
      "Send Reset Code"
    )}
  </button>
</div>






                </div>
                
              )}
              

             {showOTPInput && !showResetPassword && (
  <div className="space-y-2">
    <Label>Enter OTP</Label>
    <Input
      type="text"
      placeholder="Enter 6-digit OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      maxLength={6}
      required
    />

    {/* Verify OTP Button */}
    <div
      style={{ marginTop: "18px" }}
      className={isLoading ? "cursor-not-allowed" : ""}
    >
      <Button
        className={`w-full bg-green-500 text-white transition-all
          ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-600"}`}
        onClick={handleVerifyOtp}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            Verifying<span className="verify-dots"></span>
          </span>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </div>

    {/* 🔁 Resend OTP (ONLY when OTP screen is visible) */}
    <div className="mt-3 text-center text-sm">
      {!canResend ? (
        <span className="text-muted-foreground">
          Resend OTP in{" "}
          <span className="font-semibold">{resendTimer}s</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResendOtp}
  
  className="
    text-sm font-medium
    bg-gradient-to-r from-blue-500 to-cyan-400
    bg-clip-text text-transparent
    hover:opacity-80
    transition
  "
        >
          Resend OTP
        </button>
      )}
    </div>
  </div>
)}


              {showResetPassword && (
                <>
                  <Label>New Password</Label>

<div className="relative">
  <Input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    className="pr-10"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

                <Label>Confirm Password</Label>

<div className="relative">
  <Input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm new password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    className="pr-10"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>


                 <div
  style={{ marginTop: "18px" }}
  className={isLoading ? "cursor-not-allowed" : ""}
>
  <Button
    type="button"          // ❌ submit MAT rakho
    onClick={handleResetPassword}
    disabled={isLoading}
    className="w-full gradient-hero text-white transition-all"
  >
    {isLoading ? (
      <span className="flex items-center justify-center">
        Updating<span className="update-dots"></span>
      </span>
    ) : (
      "Update Password"
    )}
  </Button>
</div>

                </>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setFade("animate-fade-out");
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setShowOTPInput(false);
                      setShowResetPassword(false);
                      setOtp("");
                      setResetEmail("");
                      setFade("animate-fade-in");
                    }, 400);
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-all"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    
  );
};

export default Auth;
