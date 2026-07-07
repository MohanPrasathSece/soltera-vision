import { useState, type FormEvent } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../../App";
import { toast } from "sonner";
import { Magnetic } from "./MagneticButton";
import { motion, AnimatePresence } from "framer-motion";

export function AuthModals() {
  const { isLoginOpen, setLoginOpen, isSignupOpen, setSignupOpen, login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [isSignupLoading, setSignupLoading] = useState(false);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginEmail.includes("@")) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.user);
        toast.success("Successfully logged in!");
        setLoginEmail("");
      } else {
        setLoginError(data.error || "Login failed. Check your credentials.");
        toast.error(data.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Network error. Please try again later.");
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    const errs: Record<string, string> = {};
    if (!signupName.trim()) {
      errs.name = "Name is required.";
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      errs.email = "A valid email is required.";
    }
    if (!signupPhone.trim() || signupPhone.trim().length < 7) {
      errs.phone = "A valid phone number is required (min 7 digits).";
    }

    if (Object.keys(errs).length > 0) {
      setSignupErrors(errs);
      return;
    }

    setSignupLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.user);
        toast.success("Signup successful! Welcome to Soltera.");
        setSignupName("");
        setSignupEmail("");
        setSignupPhone("");
        setSignupOpen(false);
      } else {
        toast.error(data.error || "Signup failed.");
        setSignupErrors({ form: data.error || "Signup failed." });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during signup.");
    } finally {
      setSignupLoading(false);
    }
  };

  const modalClass =
    "relative w-full max-w-md overflow-hidden rounded-[32px] border border-border bg-card p-8 shadow-2xl md:p-10 z-[110]";

  const backdropClass =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4";

  const inputClass =
    "w-full rounded-2xl border border-input bg-background/50 px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <AnimatePresence>
      {/* Login Modal */}
      {isLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={backdropClass}
          onClick={() => setLoginOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={modalClass}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background glow decoration */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full opacity-[0.08] blur-[50px]"
              style={{ background: "var(--accent)" }}
            />

            <button
              onClick={() => setLoginOpen(false)}
              className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-display text-3xl text-foreground">Welcome Back</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email to log in to your educational portal.
            </p>

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputClass}
                  disabled={isLoginLoading}
                />
                {loginError && <p className="mt-1.5 text-xs text-destructive">{loginError}</p>}
              </div>

              <div className="pt-2">
                <Magnetic strength={0.15}>
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-[15px] font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                  >
                    {isLoginLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              <p className="text-center text-[13px] text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setLoginOpen(false);
                    setSignupOpen(true);
                  }}
                  className="font-semibold text-accent hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={backdropClass}
          onClick={() => setSignupOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={modalClass}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background glow decoration */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 size-48 rounded-full opacity-[0.08] blur-[50px]"
              style={{ background: "var(--accent)" }}
            />

            <button
              onClick={() => setSignupOpen(false)}
              className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-display text-3xl text-foreground">Create Account</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up to access our educational platform.
            </p>

            <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4" noValidate>
              {signupErrors.form && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                  {signupErrors.form}
                </div>
              )}

              <div>
                <label htmlFor="signup-name" className="sr-only">
                  Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className={inputClass}
                  disabled={isSignupLoading}
                />
                {signupErrors.name && (
                  <p className="mt-1.5 text-xs text-destructive">{signupErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Email Address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className={inputClass}
                  disabled={isSignupLoading}
                />
                {signupErrors.email && (
                  <p className="mt-1.5 text-xs text-destructive">{signupErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-phone" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className={inputClass}
                  disabled={isSignupLoading}
                />
                {signupErrors.phone && (
                  <p className="mt-1.5 text-xs text-destructive">{signupErrors.phone}</p>
                )}
              </div>

              <div className="pt-2">
                <Magnetic strength={0.15}>
                  <button
                    type="submit"
                    disabled={isSignupLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-[15px] font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                  >
                    {isSignupLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              <p className="text-center text-[13px] text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSignupOpen(false);
                    setLoginOpen(true);
                  }}
                  className="font-semibold text-accent hover:underline"
                >
                  Log In
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
