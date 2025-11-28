import { useState } from "react";
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
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: signupFullName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await response.json();
      if (response.status === 409) {
        toast({
          title: "⚠️ User Already Exists",
          description: "This email is already registered. Please log in instead.",
          variant: "destructive",
        });
      } else if (response.ok) {
        toast({
          title: "🎉 Account Created!",
          description: "Your account has been created. Please sign in to continue.",
          className: "bg-emerald-500 text-white border-none shadow-lg",
        });
        setActiveTab("login");
        setSignupEmail("");
        setSignupPassword("");
        setSignupFullName("");
      } else {
        toast({
          title: "Signup Failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "🚨 Network Error",
        description: "Cannot connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();

    if (response.status === 404) {
      setIsLoading(false);
      toast({
        title: "User Not Found",
        description: "No account exists with this email. Please sign up first.",
        variant: "destructive",
      });
      return;
    }

    if (response.status === 401) {
      setIsLoading(false);
      toast({
        title: "Invalid Password",
        description: "Your password is incorrect. Try again.",
        variant: "destructive",
      });
      return;
    }

    if (response.ok) {
  localStorage.setItem("userEmail", data.user?.email || loginEmail);
  localStorage.setItem("userName", data.user?.full_name || "");

  // Delay for animation
  setTimeout(() => {
    navigate("/dashboard", {
      state: {
        email: data.user?.email || loginEmail,
        justLoggedIn: true,   // 🔥 IMPORTANT FLAG
      },
    });
  }, 2000);

  return;
}


    // Unknown error
    setIsLoading(false);
    toast({
      title: "Login Error",
      description: data.message || "Unexpected error occurred.",
      variant: "destructive",
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
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
    toast({
      title: "⚠️ Enter your email",
      description: "Please enter your registered email to get a reset code.",
      variant: "destructive",
    });
    return;
  }

  setIsOtpLoading(true);

  try {
    const res = await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });

    const data = await res.json();

    if (res.status === 404) {
      toast({
        title: "🙁 User Not Found",
        description: "No account exists with this email.",
        variant: "destructive",
      });
    } else if (res.ok) {
      
      // ⭐ Delay to show animation properly
      setTimeout(() => {
        toast({
          title: "📩 OTP Sent!",
          description: "Check your inbox for your 6-digit reset code.",
          className: "bg-emerald-500 text-white border-none shadow-lg",
        });

        setShowOTPInput(true);
      }, 1500); // ⭐ 1.5 second delay (same as Sign In)
      
    } else {
      toast({
        title: "❌ Failed to Send OTP",
        description: data.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  } catch {
    toast({
      title: "🚨 Server Error",
      description: "Cannot reach backend.",
      variant: "destructive",
    });
  } finally {

    // ⭐ Smooth loading ending
    setTimeout(() => {
      setIsOtpLoading(false);
    }, 2000); // same delay
  }
};



  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "⚠️ Invalid OTP",
        description: "Please enter the 6-digit code sent to your email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "✅ OTP Verified!",
          description: "Enter your new password below.",
          className: "bg-emerald-500 text-white border-none shadow-lg",
        });
        setShowResetPassword(true);
      } else {
        toast({
          title: "❌ Verification Failed",
          description: data.message || "Incorrect OTP.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "🚨 Server Error",
        description: "Cannot connect to backend.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "⚠️ Missing Fields",
        description: "Please fill both password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "❌ Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "✅ Password Updated!",
          description: "You can now sign in with your new password.",
          className: "bg-emerald-500 text-white border-none shadow-lg",
        });

        // Smooth transition to Sign In
        setFade("animate-fade-out");
        setTimeout(() => {
          setShowForgotPassword(false);
          setShowOTPInput(false);
          setShowResetPassword(false);
          setOtp("");
          setResetEmail("");
          setFade("animate-fade-in");
        }, 400);
      } else {
        toast({
          title: "❌ Reset Failed",
          description: data.message || "Could not update password.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "🚨 Server Error",
        description: "Unable to reach backend.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 RETURN (Animated)
  return (
    <div className="min-h-screen flex items-start justify-center bg-[#cfcfcf] pt-24">
      <Card className="w-[400px] rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 transition-all duration-500 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-400 text-primary-foreground text-center py-6 rounded-xl mb-4 animate-slide-down">
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
              <TabsList className="relative flex w-full justify-between bg-[#f1f3f5] rounded-full p-1 mb-6 overflow-hidden">
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
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setFade("animate-fade-out");
                        setTimeout(() => {
                          setShowForgotPassword(true);
                          setFade("animate-fade-in");
                        }, 400);
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-all"
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
    <div className="flex items-center gap-2">

      <span className="flex">
        Processing<span className="dots"></span>
      </span>
    </div>
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
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full gradient-hero text-white hover:scale-[1.02] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
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
                  <Button
                    className="w-full bg-green-500 text-white hover:bg-green-600"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              )}

              {showResetPassword && (
                <>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    className="w-full gradient-hero text-white"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
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
