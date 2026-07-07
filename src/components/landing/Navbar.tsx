import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Magnetic } from "./MagneticButton";
import { useAuth } from "../../App";
import { AuthModals } from "./AuthModals";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, setLoginOpen, setSignupOpen } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "/#about" },
    { label: "Strategy", href: "/#strategy" },
    { label: "Performance", href: "/#performance" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled ? "glass-nav py-3" : "bg-transparent py-6"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10"
          aria-label="Primary"
        >
          <a
            href="/"
            className="text-sm font-extrabold uppercase tracking-[0.28em] text-foreground"
          >
            Soltera
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="link-underline text-[13px] font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <a
                  href="/education"
                  className="link-underline text-[13px] font-semibold text-accent transition-colors duration-300"
                >
                  Education Portal
                </a>
              </li>
            )}
          </ul>

          <div className="hidden items-center gap-6 md:flex">
            {isAuthenticated ? (
              <>
                <button
                  onClick={logout}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Log Out
                </button>
                <Magnetic strength={0.25}>
                  <a
                    href="/education"
                    className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-accent-foreground transition-transform duration-300 hover:scale-105"
                  >
                    View Portal
                  </a>
                </Magnetic>
              </>
            ) : (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Log In
                </button>
                <Magnetic strength={0.25}>
                  <button
                    onClick={() => setSignupOpen(true)}
                    className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-accent-foreground transition-transform duration-300 hover:scale-105 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </Magnetic>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-nav overflow-hidden md:hidden"
            >
              <ul className="space-y-1 px-6 py-4">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                {isAuthenticated ? (
                  <>
                    <li>
                      <a
                        href="/education"
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm font-semibold text-accent"
                      >
                        Education Portal
                      </a>
                    </li>
                    <li className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      >
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="pt-2 flex gap-4 items-center">
                    <button
                      onClick={() => {
                        setLoginOpen(true);
                        setOpen(false);
                      }}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setSignupOpen(true);
                        setOpen(false);
                      }}
                      className="inline-flex rounded-full bg-accent px-5 py-2 text-[13px] font-semibold text-accent-foreground"
                    >
                      Sign Up
                    </button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <AuthModals />
    </>
  );
}
