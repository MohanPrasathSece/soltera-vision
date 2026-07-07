import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Briefcase,
  Phone,
  Linkedin,
  Twitter,
  Check,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { RevealText } from "./RevealText";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-2xl border border-paper-border bg-paper px-5 py-4 text-[15px] text-paper-foreground placeholder:text-paper-muted/60 transition-all duration-300 focus:border-paper-foreground/30 focus:outline-none focus:ring-2 focus:ring-lime/60";

const contactItems = [
  { icon: MapPin, label: "Office", value: "One Canada Square, Level 39, London" },
  { icon: Mail, label: "Email", value: "invest@soltera.finance" },
  { icon: Briefcase, label: "Investment Desk", value: "desk@soltera.finance" },
  { icon: Phone, label: "Phone", value: "+44 20 7946 0958" },
];

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!email.trim() || !email.includes("@")) errs.email = "A valid email is required.";
    if (!phone.trim() || phone.trim().length < 7) errs.phone = "A valid phone number is required.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        toast.success("Enquiry submitted successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error(data.error || "Submission failed.");
        setErrors({ form: data.error || "Submission failed." });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-background px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1440px] rounded-[48px] bg-paper px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
        <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-paper-muted">
          04 — Contact
        </p>
        <h2 className="text-display max-w-4xl text-5xl text-paper-foreground sm:text-6xl lg:text-[5.5rem]">
          <RevealText text="Let's Build Wealth" />
          <br />
          <RevealText text="Together." className="text-paper-muted" />
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          {/* Left — contact info */}
          <div>
            <ul className="space-y-8">
              {contactItems.map(({ icon: Icon, label, value }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper-foreground text-paper">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-paper-muted">
                      {label}
                    </p>
                    <p className="mt-1 text-[15px] font-medium text-paper-foreground">{value}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <Magnetic key={label} strength={0.3}>
                  <a
                    href="#contact"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-paper-border text-paper-foreground transition-all duration-300 hover:bg-paper-foreground hover:text-paper"
                  >
                    <Icon className="size-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative rounded-[40px] border border-paper-border bg-paper-card p-8 lg:p-10"
            style={{ boxShadow: "var(--shadow-card-light)" }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                    className="flex size-16 items-center justify-center rounded-full bg-lime"
                  >
                    <Check className="size-7 text-lime-foreground" />
                  </motion.span>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-paper-foreground">
                    Enquiry Received.
                  </h3>
                  <p className="mt-2 max-w-sm text-[15px] text-paper-muted">
                    Thank you! Your enquiry has been received successfully.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} className="space-y-4" noValidate>
                  {errors.form && (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                      {errors.form}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="sr-only">
                        Name
                      </label>
                      <input
                        id="c-name"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="sr-only">
                        Email
                      </label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-phone" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="c-phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="c-message" className="sr-only">
                      Message (Optional)
                    </label>
                    <textarea
                      id="c-message"
                      name="message"
                      placeholder="Message (Optional)"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputClass} resize-none`}
                      disabled={isLoading}
                    />
                  </div>

                  <Magnetic strength={0.15}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-paper-foreground px-8 py-4.5 text-[15px] font-semibold text-paper transition-all duration-400 hover:bg-lime hover:text-lime-foreground hover:shadow-[0_10px_40px_-10px_oklch(0.93_0.208_122/50%)] disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending Enquiry...
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                        </>
                      )}
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
