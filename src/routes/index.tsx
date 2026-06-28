import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "CreatorsMela Admin — Sign In" },
      {
        name: "description",
        content:
          "Internal moderation dashboard for CreatorsMela — India's #1 Talent Management and Influencer Marketing Company.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 350);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#07070f] text-white">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="particles" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        {/* LEFT — Branding */}
        <section className="relative flex w-full flex-col justify-between overflow-hidden px-8 py-10 lg:w-[55%] lg:px-14 lg:py-12">
          {/* Bottom-left radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)",
            }}
          />

          {/* Logo */}
          <div className="relative z-10 leading-none">
            <div className="text-[2.75rem] font-extrabold tracking-tight text-white">
              Creators
            </div>
            <div className="mt-1 pl-1 text-[11px] font-medium uppercase tracking-[0.4em] text-[#9ca3af]">
              Mela
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 max-w-2xl py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-3.5 py-1.5 text-xs font-medium text-[#c4b5fd] backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 fill-[#c4b5fd]" />
              Admin Access Only
            </div>

            <h1 className="mt-7 text-[clamp(2.5rem,5.2vw,4.5rem)] font-extrabold leading-[1] tracking-tight text-white">
              We Are{" "}
              <span className="relative inline-block -rotate-3 bg-[#7C3AED] px-3 py-0.5 align-middle font-['Instrument_Serif'] font-normal italic text-white shadow-[0_8px_30px_-8px_rgba(124,58,237,0.7)]">
                Talent
              </span>{" "}
              Crafting
            </h1>

            <h2 className="mt-8 text-[clamp(1.4rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-tight">
              Moderate. Approve.{" "}
              <span className="bg-gradient-to-r from-white via-[#c4b5fd] to-[#7C3AED] bg-clip-text text-transparent">
                Keep the quality high.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-[#9ca3af]">
              Internal dashboard for reviewing creators, campaigns, and content
              submissions.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {["Fast Review", "Bulk Actions", "Activity Log"].map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/25 bg-[#0f0f1a]/80 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur"
                >
                  <span className="text-[#7C3AED]">✦</span>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-xs text-[#6b7280]">
            © 2026 CreatorsMela · Internal Use Only
          </div>
        </section>

        {/* RIGHT — Login form */}
        <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[45%] lg:px-12 lg:py-12">
          <div className="relative w-full max-w-md">
            {/* Soft purple glow behind card */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-80 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.22), transparent 60%)",
              }}
            />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f1a]/95 p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
              {/* Top edge purple highlight */}
              <div
                aria-hidden
                className="absolute inset-x-10 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)",
                }}
              />

              <div className="text-xs font-medium uppercase tracking-widest text-[#6b7280]">
                Welcome back
              </div>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white">
                Admin Sign In
              </h2>

              <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                <Field label="Email">
                  <input
                    type="email"
                    autoComplete="email"
                    defaultValue="sneha@creatorsmela.com"
                    placeholder="you@creatorsmela.com"
                    className="auth-input"
                  />
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      defaultValue="••••••••"
                      placeholder="Enter your password"
                      className="auth-input pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#6b7280] transition-colors hover:bg-white/5 hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <div className="flex items-center justify-between pt-1 text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-[#9ca3af] select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 cursor-pointer appearance-none rounded border border-white/15 bg-[#1a1a2e] transition-colors checked:border-[#7C3AED] checked:bg-[#7C3AED] checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22white%22><path d=%22M13.5 4.5L6 12l-3.5-3.5 1-1L6 10l6.5-6.5z%22/></svg>')] checked:bg-center checked:bg-no-repeat"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="font-medium text-[#7C3AED] transition-colors hover:text-[#a78bfa]"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:bg-[#8b4af0] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.99] disabled:opacity-70"
                >
                  {submitting ? "Signing in…" : "Sign In"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <div className="relative flex items-center py-2">
                  <div className="h-px flex-1 bg-white/[0.07]" />
                  <span className="px-3 text-xs uppercase tracking-wider text-[#6b7280]">
                    or continue with
                  </span>
                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>

                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-[#1a1a2e] text-sm font-medium text-white transition-colors hover:bg-[#22223a]"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>

              <p className="mt-7 text-center text-xs text-[#6b7280]">
                Having trouble? Contact your system administrator.
              </p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .auth-input {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.625rem;
          background-color: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 0 0.875rem;
          color: #ffffff;
          font-size: 0.875rem;
          transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
          outline: none;
        }
        .auth-input::placeholder { color: #4b5563; }
        .auth-input:focus {
          border-color: rgba(124,58,237,0.6);
          border-left-width: 2px;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
          background-color: #1c1c33;
        }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.5;
          will-change: transform;
        }
        .blob-a {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(124,58,237,0.45), transparent 70%);
          top: -120px; left: 40%;
          animation: floatA 18s ease-in-out infinite;
        }
        .blob-b {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(79,45,138,0.55), transparent 70%);
          bottom: -100px; right: -80px;
          animation: floatB 22s ease-in-out infinite;
        }
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px,60px) scale(1.08); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(50px,-40px) scale(1.12); }
        }

        .particles {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.35), transparent 50%),
            radial-gradient(1px 1px at 78% 18%, rgba(196,181,253,0.45), transparent 50%),
            radial-gradient(1px 1px at 34% 78%, rgba(255,255,255,0.25), transparent 50%),
            radial-gradient(1px 1px at 88% 64%, rgba(196,181,253,0.35), transparent 50%),
            radial-gradient(1px 1px at 52% 44%, rgba(255,255,255,0.2), transparent 50%);
          animation: drift 40s linear infinite;
          opacity: 0.6;
        }
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-40px); }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#9ca3af]">{label}</span>
      {children}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
