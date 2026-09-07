import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  HeartPulse,
  LineChart,
  Shield,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

const spark = [
  { v: 68 },
  { v: 70 },
  { v: 69 },
  { v: 73 },
  { v: 76 },
  { v: 74 },
  { v: 78 },
];

const features = [
  {
    icon: Activity,
    title: "Risk Prediction",
    copy: "See an estimated view of cardiovascular, metabolic, and lifestyle risk in one place.",
  },
  {
    icon: Brain,
    title: "Explainable AI",
    copy: "Understand which factors raise or lower your estimated risk — in plain language.",
  },
  {
    icon: SlidersHorizontal,
    title: "What-if Simulation",
    copy: "Move the sliders and watch how lifestyle changes could shift your outlook.",
  },
  {
    icon: Shield,
    title: "Personalized Prevention",
    copy: "A focused plan across movement, nutrition, sleep, hydration, and wellness.",
  },
  {
    icon: LineChart,
    title: "Health Tracking",
    copy: "Follow trends, streaks, and small wins so progress stays visible.",
  },
];

const steps = [
  {
    n: "01",
    title: "Enter health information",
    copy: "Capture lifestyle, vitals, and history in a calm, structured profile.",
  },
  {
    n: "02",
    title: "Analyze risk",
    copy: "Generate an estimated multi-domain risk snapshot from your inputs.",
  },
  {
    n: "03",
    title: "Understand your risk",
    copy: "See contributing and protective factors with a contribution view.",
  },
  {
    n: "04",
    title: "Take preventive action",
    copy: "Simulate changes, follow a plan, and track week-over-week progress.",
  },
];

const benefits = [
  {
    title: "AI-powered insights",
    copy: "A digital twin that turns everyday inputs into a clear health snapshot.",
  },
  {
    title: "Personalized recommendations",
    copy: "Priorities that match your lifestyle — not a generic checklist.",
  },
  {
    title: "Explainable predictions",
    copy: "See why a score moved, not just the number on the card.",
  },
  {
    title: "Lifestyle simulation",
    copy: "Test sleep, steps, and nutrition changes before you commit.",
  },
];

export default function Landing() {
  const { login, register, enterLocalSession } = useAuth();
  const navigate = useNavigate();

  const startDemo = async () => {
    const email = "alex@vitalai.demo";
    const password = "demo1234";

    try {
      try {
        await login({
          email,
          password,
          fullName: "Alex Rivera",
        });
      } catch {
        await register({
          fullName: "Alex Rivera",
          email,
          password,
        });
      }
    } catch {
      enterLocalSession({
        fullName: "Alex Rivera",
        email,
      });
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2 font-extrabold tracking-tight text-navy"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-xs text-white">
              V
            </span>

            VitalAI
          </a>

          {/* NAVBAR */}
          <nav
            className="hidden items-center gap-8 text-sm font-medium text-muted md:flex"
            aria-label="Landing"
          >
            <a
              href="#how"
              className="transition-colors hover:text-navy"
            >
              How it works
            </a>

            <a
              href="#features"
              className="transition-colors hover:text-navy"
            >
              Features
            </a>

            <a
              href="#benefits"
              className="transition-colors hover:text-navy"
            >
              Benefits
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-navy sm:inline-flex"
            >
              Login
            </Link>

            <Button
              size="sm"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section
        id="top"
        className="page-grid overflow-hidden"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-teal">
              <Sparkles size={14} />
              AI Health Digital Twin
            </p>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
              Understand Your Health. Before It Becomes a Problem.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              VitalAI uses AI-powered health insights to estimate your
              risk, explain the factors behind it, and help you build a
              healthier future.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
              >
                Get Started
                <ArrowRight size={16} />
              </Button>

              <Button
                size="lg"
                variant="ghost"
                onClick={startDemo}
              >
                Explore Demo
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted">
              Prototype for education and demonstration. Not a medical
              diagnosis.
            </p>
          </div>

          {/* HEALTH TWIN PREVIEW */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal/15 via-transparent to-cyan/10 blur-2xl" />

            <div className="relative rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_30px_80px_-40px_rgba(11,31,58,0.55)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Health twin
                  </p>

                  <p className="text-lg font-bold text-navy">
                    Alex Rivera
                  </p>
                </div>

                <span className="rounded-full bg-good/10 px-3 py-1 text-xs font-semibold text-good">
                  Good
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-navy p-4 text-white">
                  <p className="text-xs text-white/60">
                    Health score
                  </p>

                  <p className="mt-1 text-3xl font-extrabold">
                    78
                  </p>

                  <p className="text-xs text-teal-500">
                    +4 this week
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs text-muted">
                    Estimated risk
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-navy">
                    23%
                  </p>

                  <p className="text-xs font-semibold text-good">
                    Low
                  </p>
                </div>

                <MiniStat
                  label="Activity"
                  value="7.2k"
                  hint="steps"
                />

                <MiniStat
                  label="Sleep"
                  value="6.5h"
                  hint="last night"
                />

                <MiniStat
                  label="Heart health"
                  value="72"
                  hint="bpm resting"
                />

                <div className="rounded-2xl border border-line bg-white p-3">
                  <p className="mb-1 text-xs text-muted">
                    7-day trend
                  </p>

                  <div className="h-12">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart data={spark}>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#0D9B8A"
                          fill="#14B8A6"
                          fillOpacity={0.18}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
          How it works
        </p>

        <h2 className="mt-2 text-3xl font-extrabold text-navy">
          Four steps to a clearer outlook
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-[1.25rem] border border-line bg-white p-5 shadow-[var(--shadow-soft)]"
            >
              <p className="text-sm font-extrabold text-teal">
                {step.n}
              </p>

              <h3 className="mt-3 font-bold text-navy">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="scroll-mt-20 bg-navy py-16 text-white"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-500">
            Features
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            Built for prevention, not panic
          </h2>

          <p className="mt-2 max-w-2xl text-white/60">
            A focused product surface — risk, explanation,
            simulation, and follow-through.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <Icon
                    className="text-teal-500"
                    size={22}
                  />

                  <h3 className="mt-4 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/65">
                    {feature.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section
        id="benefits"
        className="scroll-mt-20 border-y border-line bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Benefits
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-navy">
              Why VitalAI?
            </h2>

            <p className="mt-2 max-w-2xl text-muted">
              Turn health data into simple, understandable and
              actionable insights.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-line bg-canvas p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10">
                  <HeartPulse
                    className="text-teal"
                    size={20}
                  />
                </div>

                <h3 className="mt-4 font-bold text-navy">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy to-navy-700 px-8 py-12 text-white sm:px-12">
          <h2 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Your healthier future starts with understanding today.
          </h2>

          <p className="mt-3 max-w-lg text-white/70">
            Create an account or open the demo to walk the full
            prevention flow in minutes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="teal"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="!border-white/15 !bg-white/10 !text-white"
              onClick={startDemo}
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-bold text-navy">
            VitalAI
          </p>

          <p>
            Hackathon prototype · Educational use only
          </p>

          <div className="flex gap-4">
            <Link to="/login">
              Login
            </Link>

            <a href="#features">
              Features
            </a>

            <a href="#benefits">
              Benefits
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MiniStat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs text-muted">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-navy">
        {value}
      </p>

      <p className="flex items-center gap-1 text-[11px] text-muted">
        <CheckCircle2
          size={12}
          className="text-teal"
        />
        {hint}
      </p>
    </div>
  );
}