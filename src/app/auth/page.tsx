"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect");
    if (r) setRedirectTo(r);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "signin" ? { email, password } : { fullName, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Kuch masla ho gaya");
        setLoading(false);
        return;
      }

      toast.success(mode === "signin" ? "Sign in ho gaya!" : "Account ban gaya!");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Network error, dobara try karein");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        className="relative hidden md:block overflow-hidden bg-primary cursor-default"
      >
        <style>{`
          @keyframes blobMoveA {
            0%, 100% { transform: translate(-10%, -10%) scale(1); }
            33% { transform: translate(20%, 10%) scale(1.25); }
            66% { transform: translate(-5%, 25%) scale(0.9); }
          }
          @keyframes blobMoveB {
            0%, 100% { transform: translate(15%, 20%) scale(1); }
            50% { transform: translate(-20%, -10%) scale(1.3); }
          }
          @keyframes blobMoveC {
            0%, 100% { transform: translate(0%, 0%) scale(1); }
            40% { transform: translate(-25%, 15%) scale(1.15); }
            75% { transform: translate(15%, -20%) scale(0.85); }
          }
        `}</style>
        <div className="absolute inset-0 bg-primary" />
        <div
          className="absolute -top-1/4 -left-1/4 h-[70%] w-[70%] rounded-full blur-[110px] opacity-40"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)", animation: "blobMoveA 22s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[65%] w-[65%] rounded-full blur-[110px] opacity-35"
          style={{ background: "radial-gradient(circle, #7A1F2B, transparent 70%)", animation: "blobMoveB 26s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-[50%] w-[50%] rounded-full blur-[100px] opacity-25"
          style={{ background: "radial-gradient(circle, #2F6B4F, transparent 70%)", animation: "blobMoveC 30s ease-in-out infinite" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-black/80" />
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle 220px at ${mousePos.x}% ${mousePos.y}%, rgba(212,175,55,0.12), transparent 70%)` }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="motif" width="140" height="140" patternUnits="userSpaceOnUse">
              <circle cx="70" cy="70" r="1" fill="currentColor" />
              <path d="M70 20 C 90 40, 90 100, 70 120 C 50 100, 50 40, 70 20 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#motif)" className="text-gold" />
        </svg>
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground pointer-events-none">
          <Link href="/" className="group flex items-center gap-2 pointer-events-auto w-fit">
            <ArrowLeft className="h-4 w-4 text-primary-foreground/60 group-hover:text-gold group-hover:-translate-x-1 transition-all duration-300" />
            <span className="text-display text-3xl">House of Aura</span>
          </Link>
          <div className="anim-fade-up">
            <div className="text-xs uppercase tracking-[0.4em] text-gold/90">Members</div>
            <h2 className="text-display text-6xl mt-4 leading-[0.95]">
              A wardrobe, <em className="text-gold not-italic">curated</em> for you.
            </h2>
            <p className="mt-6 max-w-md text-primary-foreground/70">
              Sign in to save your favourites and get early access to new drops.
            </p>
            <div className="mt-8 h-px w-24 bg-gold/60" />
          </div>
          <div className="text-xs text-primary-foreground/50">© House of Aura 2026</div>
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 md:p-16 max-w-lg w-full mx-auto">
        <Link href="/" className="md:hidden text-display text-2xl mb-8">HEEMIA</Link>
        <div key={mode} className="anim-fade-up">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {mode === "signin" ? "Welcome back" : "Join Heemia"}
          </div>
          <h1 className="text-display text-5xl md:text-7xl mt-3">
            {mode === "signin" ? "Sign in." : "Create account."}
          </h1>
        </div>
        <form key={`${mode}-form`} className="mt-12 space-y-7 anim-fade-up" style={{ animationDelay: "80ms" }} onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="anim-fade-up group">
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Full name</label>
              <div className="mt-2 flex items-center gap-3 border-b border-border py-3 group-focus-within:border-gold transition-colors duration-300">
                <User className="h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-transparent outline-none placeholder:text-muted-foreground/40 text-base"
                />
              </div>
            </div>
          )}
          <div className="group">
            <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <div className="mt-2 flex items-center gap-3 border-b border-border py-3 group-focus-within:border-gold transition-colors duration-300">
              <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground/40 text-base"
              />
            </div>
          </div>
          <div className="group">
            <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Password</label>
            <div className="mt-2 flex items-center gap-3 border-b border-border py-3 group-focus-within:border-gold transition-colors duration-300">
              <Lock className="h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground/40 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted-foreground hover:text-gold transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-gold-foreground transition-all duration-300 mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === "signin" ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
        <div className="mt-8 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>New here?{" "}
              <button onClick={() => setMode("signup")} className="text-foreground underline underline-offset-4 decoration-border hover:decoration-gold hover:text-gold transition-colors">
                Create an account
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-foreground underline underline-offset-4 decoration-border hover:decoration-gold hover:text-gold transition-colors">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
