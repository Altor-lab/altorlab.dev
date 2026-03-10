import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Cpu,
  Database,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Package,
  BookOpen,
  Menu,
  X,
  Zap,
  FileCode2,
  Globe,
  ChevronRight,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Intersection Observer hook for scroll animations                   */
/* ------------------------------------------------------------------ */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav                                                                */
/* ------------------------------------------------------------------ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/80 backdrop-blur-xl border-b border-surface-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-accent text-lg">&#x1F33F;</span>
          <span className="font-display font-bold text-xl tracking-tight text-text-primary">
            moss
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#benchmarks"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Benchmarks
          </a>
          <a
            href="#pricing"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Pricing
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <Github size={14} />
            GitHub
          </a>
          <a
            href="https://npmjs.com"
            target="_blank"
            rel="noopener"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <Package size={14} />
            npm
          </a>
          <a
            href="#get-started"
            className="text-sm font-medium bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-lg hover:bg-accent/15 transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-raised border-b border-surface-border px-6 pb-6 pt-2">
          <div className="flex flex-col gap-4">
            <a
              href="#benchmarks"
              className="text-sm text-text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Benchmarks
            </a>
            <a
              href="#pricing"
              className="text-sm text-text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener"
              className="text-sm text-text-secondary flex items-center gap-1.5"
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href="#get-started"
              className="text-sm font-medium text-accent"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  const [copied, setCopied] = useState(false);

  const copyCmd = useCallback(() => {
    navigator.clipboard.writeText("npm install moss-search");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div
        className="glow-orb"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 400,
          height: 400,
          bottom: "5%",
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center py-24">
        {/* Badge */}
        <FadeUp>
          <div className="inline-flex items-center gap-2 bg-accent-glow border border-accent/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-mono text-accent tracking-wide">
              HNSW-POWERED &middot; RUST/WASM
            </span>
          </div>
        </FadeUp>

        {/* Headline */}
        <FadeUp delay={80}>
          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-[-0.04em] leading-[1.05] mb-6">
            Semantic search
            <br />
            <span className="text-accent">in your browser.</span>
          </h1>
        </FadeUp>

        {/* Sub-headline */}
        <FadeUp delay={160}>
          <p className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
            54 KB of WASM. Sub-millisecond latency.
            <br className="hidden sm:block" />
            No server. No per-query costs. Your users' data never leaves their browser.
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* npm install block */}
            <div
              className="code-block relative group flex items-center bg-surface-raised border border-surface-border rounded-xl px-5 py-3 cursor-pointer hover:border-surface-border-hover transition-colors"
              onClick={copyCmd}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && copyCmd()}
            >
              <span className="font-mono text-sm text-text-muted mr-1 select-none">
                $
              </span>
              <span className="font-mono text-sm text-text-primary">
                npm install moss-search
              </span>
              <span className="copy-btn ml-4 text-text-muted hover:text-accent transition-colors">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </div>

            {/* View demo */}
            <a
              href="#demo"
              className="flex items-center gap-2 bg-accent text-surface font-semibold text-sm px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
            >
              View Demo
              <ArrowRight size={15} />
            </a>
          </div>
        </FadeUp>

        {/* Trust line */}
        <FadeUp delay={320}>
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-accent" />
              Open source
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-accent" />
              TypeScript types
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={12} className="text-accent" />
              Zero dependencies
            </span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Bar                                                          */
/* ------------------------------------------------------------------ */
function StatsBar() {
  const stats = [
    { value: "54KB", label: "gzipped", icon: Package },
    { value: "0.4ms", label: "p95 latency", icon: Zap },
    { value: "10K", label: "vectors", icon: Database },
    { value: "384d", label: "dimensions", icon: Cpu },
  ];

  return (
    <section className="relative border-y border-surface-border bg-surface-raised/50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-glow border border-accent/10 flex items-center justify-center">
                  <s.icon size={18} className="text-accent" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl tracking-tight text-text-primary">
                    {s.value}
                  </div>
                  <div className="text-xs text-text-muted font-mono uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Embed your content",
      desc: "Use any embedding model (OpenAI, Cohere, sentence-transformers) to generate vectors from your documents.",
      icon: FileCode2,
    },
    {
      num: "02",
      title: "Build the index",
      desc: "Our CLI builds an optimized HNSW index from your embeddings. Serialize it to a single .bin file.",
      icon: Database,
    },
    {
      num: "03",
      title: "Search client-side",
      desc: "Load the 54KB WASM module and your index in the browser. Sub-millisecond search, zero server costs.",
      icon: Search,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
              How it works
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em] mt-3">
              Three steps to semantic search
            </h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 100}>
              <div className="group relative bg-surface-raised border border-surface-border rounded-xl p-8 hover:border-surface-border-hover transition-all duration-300 h-full">
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm font-semibold text-accent">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-accent-glow border border-accent/10 flex items-center justify-center group-hover:bg-accent-glow-strong transition-colors">
                    <step.icon size={18} className="text-accent" />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector arrow (not on last) */}
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-surface border border-surface-border items-center justify-center">
                    <ChevronRight size={12} className="text-text-muted" />
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Benchmarks                                                         */
/* ------------------------------------------------------------------ */
function Benchmarks() {
  return (
    <section
      id="benchmarks"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
              Performance
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em] mt-3">
              Benchmarks that speak for themselves
            </h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">
              10,000 vectors, 384 dimensions. Real MS MARCO passages with
              sentence-transformer embeddings.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="overflow-x-auto rounded-xl border border-surface-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-raised">
                  <th className="text-left font-mono font-medium text-text-muted text-xs uppercase tracking-wider px-6 py-4">
                    Metric
                  </th>
                  <th className="text-right font-mono font-medium text-text-muted text-xs uppercase tracking-wider px-6 py-4">
                    Value
                  </th>
                  <th className="text-right font-mono font-medium text-text-muted text-xs uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {[
                  {
                    metric: "Native latency (ef=50)",
                    value: "258 µs",
                    note: "Rust, release mode",
                  },
                  {
                    metric: "WASM latency (ef=50)",
                    value: "0.48 ms",
                    note: "Chrome, 10K/384d",
                  },
                  {
                    metric: "WASM p95 latency",
                    value: "0.40 ms",
                    note: "100 queries, top-10",
                  },
                  {
                    metric: ".wasm size (raw)",
                    value: "117 KB",
                    note: "4.2x under 500KB target",
                  },
                  {
                    metric: ".wasm size (gzipped)",
                    value: "54 KB",
                    note: "3.6x under 200KB target",
                  },
                  {
                    metric: "Recall@10 (ef=500)",
                    value: "0.954",
                    note: "Random 384d vectors",
                  },
                  {
                    metric: "Relevance (real queries)",
                    value: "19/20",
                    note: "MS MARCO passages",
                  },
                  {
                    metric: "Index load time",
                    value: "19.5 ms",
                    note: "10K vectors, Chrome",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-surface-overlay/50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-text-primary">
                      {row.metric}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold text-accent">
                      {row.value}
                    </td>
                    <td className="px-6 py-3.5 text-right text-text-muted hidden sm:table-cell">
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison                                                         */
/* ------------------------------------------------------------------ */
function Comparison() {
  const cols = ["", "moss", "Algolia", "Orama", "Voy"];
  const rows = [
    {
      label: "Approach",
      values: ["Client-side", "Server-side", "Client + Cloud", "Client-side"],
    },
    {
      label: "Binary size",
      values: ["54 KB gz", "N/A (SaaS)", "<2 KB (JS)", "75 KB gz"],
    },
    {
      label: "Algorithm",
      values: ["HNSW", "Proprietary", "Brute-force", "k-d tree"],
    },
    {
      label: "Cost model",
      values: [
        "Flat / free",
        "$0.50–1.75/1K",
        "Free + paid",
        "Free (no maint.)",
      ],
    },
    {
      label: "Latency",
      values: ["<1 ms", "50–200 ms", "~5 ms", "~3 ms"],
    },
    {
      label: "Privacy",
      values: ["Data stays local", "Sent to server", "Cloud option", "Data stays local"],
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
              Comparison
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em] mt-3">
              moss vs. alternatives
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="overflow-x-auto rounded-xl border border-surface-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-raised">
                  {cols.map((col, i) => (
                    <th
                      key={i}
                      className={`text-left font-mono font-medium text-xs uppercase tracking-wider px-5 py-4 ${
                        i === 1
                          ? "text-accent"
                          : i === 0
                          ? "text-text-muted"
                          : "text-text-muted"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    <td className="px-5 py-3.5 font-mono text-xs text-text-muted uppercase tracking-wider whitespace-nowrap">
                      {row.label}
                    </td>
                    {row.values.map((val, vi) => (
                      <td
                        key={vi}
                        className={`px-5 py-3.5 ${
                          vi === 0
                            ? "moss-row font-semibold text-text-primary"
                            : "text-text-secondary"
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */
function Pricing() {
  const tiers = [
    {
      name: "Open Source",
      price: "Free",
      period: "",
      desc: "Self-host everything. Perfect for side projects and experimentation.",
      features: [
        "Full WASM search engine",
        "Up to 1K pages",
        "Bring your own embeddings",
        "Community support",
        "MIT license",
      ],
      cta: "npm install",
      ctaStyle: "secondary" as const,
      popular: false,
    },
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      desc: "Managed pipeline for small sites. We handle embeddings, indexing, and CDN.",
      features: [
        "Up to 10K pages",
        "Managed embed + build pipeline",
        "CDN-hosted index",
        "One script tag integration",
        "Email support",
      ],
      cta: "Get Started",
      ctaStyle: "primary" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$99",
      period: "/mo",
      desc: "For growing teams that need custom branding and priority support.",
      features: [
        "Up to 50K pages",
        "Custom search UI branding",
        "Priority support",
        "Analytics dashboard",
        "Automatic re-indexing",
      ],
      cta: "Get Started",
      ctaStyle: "primary" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$249",
      period: "/mo",
      desc: "For large-scale deployments with SLA guarantees.",
      features: [
        "Up to 200K pages",
        "99.9% uptime SLA",
        "Dedicated support channel",
        "Custom embeddings model",
        "On-prem option",
      ],
      cta: "Contact Us",
      ctaStyle: "secondary" as const,
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
              Pricing
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em] mt-3">
              Start free, scale as you grow
            </h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">
              The search engine is open source. Pay only for the managed
              pipeline that builds and hosts your index.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div
                className={`relative flex flex-col bg-surface-raised border rounded-xl p-7 h-full ${
                  tier.popular
                    ? "pricing-popular border-transparent"
                    : "border-surface-border hover:border-surface-border-hover"
                } transition-colors`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-surface text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display font-semibold text-lg text-text-primary">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="font-display font-bold text-3xl tracking-tight text-text-primary">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-sm text-text-muted">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2.5 text-sm text-text-secondary"
                    >
                      <Check
                        size={14}
                        className="text-accent mt-0.5 flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.name === "Enterprise" ? "#contact" : "#get-started"}
                  className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                    tier.ctaStyle === "primary"
                      ? "bg-accent text-surface hover:bg-accent/90"
                      : "bg-surface-overlay border border-surface-border text-text-primary hover:border-surface-border-hover"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Consulting CTA                                                     */
/* ------------------------------------------------------------------ */
function ConsultingCTA() {
  return (
    <section id="contact" className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="relative bg-surface-raised border border-surface-border rounded-2xl p-10 md:p-16 text-center overflow-hidden">
            {/* Subtle glow */}
            <div
              className="glow-orb"
              style={{
                width: 500,
                height: 500,
                top: "-40%",
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <span className="font-mono text-xs text-accent tracking-widest uppercase">
                Custom Integration
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em] mt-3 mb-4">
                Need something bespoke?
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                We offer Rust/WASM consulting for teams that need custom vector
                search, performance optimization, or full integration support.
                $150–250/hr.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:hello@mossearch.dev"
                  className="flex items-center gap-2 bg-accent text-surface font-semibold text-sm px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
                >
                  <Mail size={15} />
                  Contact Us
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <BookOpen size={15} />
                  View case studies
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Terminal Demo (visual, not live)                                    */
/* ------------------------------------------------------------------ */
function TerminalDemo() {
  return (
    <section id="demo" className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-accent tracking-widest uppercase">
              See it in action
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em] mt-3">
              Real semantic search, fully client-side
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={120}>
          <div className="max-w-3xl mx-auto">
            {/* Terminal chrome */}
            <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-text-muted font-mono ml-2">
                  moss-search — demo
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm leading-loose">
                <div className="text-text-muted">
                  <span className="text-accent">$</span> npx moss-search
                  build ./docs
                </div>
                <div className="text-text-secondary mt-1">
                  <span className="text-text-muted">  ✓</span> Loaded 847
                  documents
                </div>
                <div className="text-text-secondary">
                  <span className="text-text-muted">  ✓</span> Generated
                  embeddings (all-MiniLM-L6-v2)
                </div>
                <div className="text-text-secondary">
                  <span className="text-text-muted">  ✓</span> Built HNSW
                  index (M=16, ef=200)
                </div>
                <div className="text-text-secondary">
                  <span className="text-text-muted">  ✓</span> Output:{" "}
                  <span className="text-accent">index.bin</span> (1.4 MB) +{" "}
                  <span className="text-accent">metadata.json</span>
                </div>
                <div className="mt-4 text-text-muted">
                  <span className="text-accent">$</span> # Add one script tag
                  to your HTML:
                </div>
                <div className="text-text-secondary mt-1 break-all">
                  {'<script src="https://cdn.mossearch.dev/embed.js"'}
                </div>
                <div className="text-text-secondary pl-6 break-all">
                  {'  data-index="/index.bin"></script>'}
                </div>
                <div className="mt-4 text-text-muted">
                  <span className="text-accent">▸</span> Search:{" "}
                  <span className="text-text-primary">
                    "how to configure webhooks"
                  </span>
                  <span className="cursor-blink text-accent">▎</span>
                </div>
                <div className="mt-2 ml-2 space-y-1">
                  <div className="text-text-secondary">
                    <span className="text-accent font-semibold">0.73</span>{" "}
                    Setting Up Webhook Endpoints — Configuration Guide
                  </div>
                  <div className="text-text-secondary">
                    <span className="text-accent font-semibold">0.68</span>{" "}
                    Webhook Events Reference — API Documentation
                  </div>
                  <div className="text-text-secondary">
                    <span className="text-accent font-semibold">0.61</span>{" "}
                    Debugging Failed Webhook Deliveries
                  </div>
                </div>
                <div className="mt-3 text-text-muted text-xs">
                  ⏱ WASM search: 0.4ms &middot; Embedding: 48ms &middot; Total:
                  48.4ms
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-surface-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-accent text-lg">&#x1F33F;</span>
            <span className="font-display font-bold text-lg tracking-tight text-text-primary">
              moss
            </span>
            <span className="text-xs text-text-muted ml-2 font-mono">
              Built with Rust
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener"
              className="hover:text-text-secondary transition-colors flex items-center gap-1.5"
            >
              <Github size={14} />
              GitHub
            </a>
            <a
              href="https://npmjs.com"
              target="_blank"
              rel="noopener"
              className="hover:text-text-secondary transition-colors flex items-center gap-1.5"
            >
              <Package size={14} />
              npm
            </a>
            <a
              href="#"
              className="hover:text-text-secondary transition-colors flex items-center gap-1.5"
            >
              <BookOpen size={14} />
              Docs
            </a>
            <a
              href="mailto:hello@mossearch.dev"
              className="hover:text-text-secondary transition-colors flex items-center gap-1.5"
            >
              <Mail size={14} />
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} moss. Open source under MIT
            license.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <a href="#" className="hover:text-text-secondary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-text-secondary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Get Started Section                                                */
/* ------------------------------------------------------------------ */
function GetStarted() {
  const [copied, setCopied] = useState(false);

  const copyCmd = useCallback(() => {
    navigator.clipboard.writeText("npm install moss-search");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section
      id="get-started"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[-0.03em]">
              Get started in seconds
            </h2>
            <p className="text-text-secondary mt-3 mb-8 max-w-md mx-auto">
              Install the npm package and add semantic search to your site
              today.
            </p>

            {/* Code blocks */}
            <div className="max-w-xl mx-auto space-y-3 text-left">
              <div
                className="code-block relative group flex items-center bg-surface-raised border border-surface-border rounded-xl px-5 py-4 cursor-pointer hover:border-surface-border-hover transition-colors"
                onClick={copyCmd}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && copyCmd()}
              >
                <span className="font-mono text-sm text-text-muted mr-3 select-none">
                  $
                </span>
                <span className="font-mono text-sm text-text-primary">
                  npm install moss-search
                </span>
                <span className="copy-btn ml-auto text-text-muted hover:text-accent transition-colors">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </span>
              </div>

              <div className="bg-surface-raised border border-surface-border rounded-xl px-5 py-4">
                <pre className="font-mono text-sm text-text-secondary overflow-x-auto">
                  <code>
                    <span className="text-accent">import</span>
                    {" { MossSearch } "}
                    <span className="text-accent">from</span>
                    {" 'moss-search';\n\n"}
                    <span className="text-text-muted">// Load your pre-built index</span>
                    {"\n"}
                    <span className="text-accent">const</span>
                    {" engine = "}
                    <span className="text-accent">await</span>
                    {" MossSearch."}
                    <span className="text-text-primary">load</span>
                    {"('/index.bin');\n\n"}
                    <span className="text-text-muted">// Search with any query vector</span>
                    {"\n"}
                    <span className="text-accent">const</span>
                    {" results = engine."}
                    <span className="text-text-primary">search</span>
                    {"(queryVector, 10);"}
                  </code>
                </pre>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-text-muted">
              <a
                href="#"
                className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
              >
                <BookOpen size={14} />
                Read the docs
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
              >
                <Globe size={14} />
                Live demo
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <div className="noise-bg">
      <Nav />
      <Hero />
      <StatsBar />
      <TerminalDemo />
      <HowItWorks />
      <Benchmarks />
      <Comparison />
      <Pricing />
      <GetStarted />
      <ConsultingCTA />
      <Footer />
    </div>
  );
}
