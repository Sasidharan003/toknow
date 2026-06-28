import { useState } from "react";
import { useLocation } from "wouter";
import { Landmark, Shield, User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLoginSuccess: (user: { id: number; email: string; role: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("citizen"); // "citizen" | "lawyer"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
    
    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      toast({
        title: isSignUp ? "Account Created" : "Welcome Back",
        description: isSignUp ? "Your account was successfully registered!" : "You have logged in successfully.",
      });

      onLoginSuccess(data.user);
      setLocation("/");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Portal Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/15 border border-primary/20 rounded-2xl mb-3 shadow-inner">
            <Landmark className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
            TO KNOW
          </h1>
          <p className="text-xs text-muted-foreground mt-1 text-center font-medium">
            AI-Powered Legal Rights &amp; Welfare Platform
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 bg-slate-950 border border-slate-800/80 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setEmail(""); setPassword(""); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${!isSignUp ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-white"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setEmail(""); setPassword(""); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${isSignUp ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-white"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-950 border-slate-800/80 text-white placeholder-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Password:</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-slate-950 border-slate-800/80 text-white placeholder-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Confirm Password:</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-slate-950 border-slate-800/80 text-white placeholder-slate-600 focus-visible:ring-primary focus-visible:ring-offset-0 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Account Role:</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${role === "citizen" ? "border-primary bg-primary/5 text-white" : "border-slate-800 bg-slate-950 text-muted-foreground hover:text-white"}`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold">Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("lawyer")}
                    className={`py-2 px-3 border rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${role === "lawyer" ? "border-primary bg-primary/5 text-white" : "border-slate-800 bg-slate-950 text-muted-foreground hover:text-white"}`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-semibold">Lawyer</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-lg shadow-primary/20 mt-4 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/35 border-t-primary-foreground rounded-full animate-spin" />
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Subtitle details */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-semibold">
          <CheckCircle className="w-3.5 h-3.5 text-primary" />
          <span>SSL Secure &bull; Password Encrypted</span>
        </div>
      </div>
    </div>
  );
}
