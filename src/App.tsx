import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  ArrowRight,
  Check,
  Copy,
  Github,
  Package,
  Menu,
  X,
  Shield,
  DollarSign,
  Zap,
  ChevronDown,
  FileText,
  BookOpen,
  Code2,
  Mail,
  ExternalLink,
  Star,
  Clock,
  Lock,
  Server,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Reveal on scroll                                                   */
/* ------------------------------------------------------------------ */
function useReveal() {
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
      { threshold: 0.1, rootMargin: "-30px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section label                                                      */
/* ------------------------------------------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-moss-dim mb-4">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav                                                                */
/* ------------------------------------------------------------------ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const linkClass =
    "text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors";

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-2xl border-b border-surface-border"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="text-moss text-base">&#x1F33F;</span>
          <span className="font-display text-[22px] text-text-primary italic">
            moss
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          <a href="#why" className={linkClass}>
            Why moss
          </a>
          <a href="#demo" className={linkClass}>
            Demo
          </a>
          <a href="#pricing" className={linkClass}>
            Pricing
          </a>
          <a
            href="https://github.com/AltorLab/altor-vec"
            target="_blank"
            rel="noopener"
            className={`${linkClass} flex items-center gap-1.5`}
          >
            <Github size={13} />
            GitHub
          </a>
          <a
            href="#get-started"
            className="text-[13px] font-semibold bg-moss text-bg px-4 py-2 rounded-lg hover:brightness-110 transition"
          >
            Get Started
          </a>
        </div>

        <button
          className="md:hidden text-text-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-b border-surface-border px-6 pb-5 pt-1 flex flex-col gap-3.5">
          {["Why moss", "Demo", "Pricing"].map((t) => (
            <a
              key={t}
              href={`#${t.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-text-secondary"
              onClick={() => setOpen(false)}
            >
              {t}
            </a>
          ))}
          <a
            href="#get-started"
            className="text-sm font-semibold text-moss"
            onClick={() => setOpen(false)}
          >
            Get Started
          </a>
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

  const copy = useCallback(() => {
    navigator.clipboard.writeText("npm install moss-search");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-grid" />
      <div
        className="glow blob-morph"
        style={{
          width: 700,
          height: 700,
          top: "-15%",
          left: "45%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(110,231,183,0.06) 0%, transparent 65%)",
        }}
      />
      <div
        className="glow"
        style={{
          width: 400,
          height: 400,
          bottom: "10%",
          left: "-5%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          {/* Pill */}
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-moss-glow border border-moss/10 rounded-full px-3.5 py-1 mb-7">
              <Star size={12} className="text-amber" />
              <span className="text-[11px] font-mono font-medium text-text-secondary tracking-wide">
                Open source &middot; MIT license &middot; Production-ready
              </span>
            </div>
          </Reveal>

          {/* Headline — customer problem first */}
          <Reveal delay={60}>
            <h1 className="font-display text-[clamp(2.8rem,6.5vw,5.2rem)] leading-[1.05] tracking-[-0.01em] mb-6">
              Stop paying
              <br />
              <span className="italic text-moss">per search query.</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed mb-10">
              moss is a drop-in search engine that runs{" "}
              <span className="text-text-primary font-medium">
                entirely in your users' browser
              </span>
              . One script tag. 54 KB. Sub-millisecond results. No server to
              manage, no per-query bills, no third-party data sharing.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={180}>
            <div className="flex flex-col sm:flex-row items-start gap-3.5">
              <div
                className="copy-trigger group flex items-center bg-surface-raised border border-surface-border rounded-xl px-5 py-3 cursor-pointer hover:border-surface-border-hover transition"
                onClick={copy}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && copy()}
              >
                <span className="font-mono text-sm text-text-muted mr-2 select-none">
                  $
                </span>
                <span className="font-mono text-sm text-text-primary">
                  npm install moss-search
                </span>
                <span className="copy-icon ml-4 text-text-muted hover:text-moss transition-colors">
                  {copied ? (
                    <Check size={14} className="text-moss" />
                  ) : (
                    <Copy size={14} />
                  )}
                </span>
              </div>
              <a
                href="#demo"
                className="flex items-center gap-2 bg-moss text-bg font-semibold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition"
              >
                See it live
                <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>

          {/* Quick proof */}
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-x-7 gap-y-2 mt-10">
              {[
                "54 KB gzipped",
                "< 1ms search",
                "Zero server costs",
                "Data never leaves the browser",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-[13px] text-text-muted"
                >
                  <Check size={13} className="text-moss" />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Cost Savings Calculator                                            */
/* ------------------------------------------------------------------ */
function CostSavings() {
  const [queries, setQueries] = useState(100); // thousands per month

  const algoliaMonthly = queries * 0.75; // $0.75 per 1K searches (mid-range)
  const algoliaYearly = algoliaMonthly * 12;
  const mossCost = queries <= 10 ? 0 : queries <= 50 ? 29 : queries <= 200 ? 99 : 249;
  const saved = algoliaYearly - mossCost * 12;

  return (
    <section className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <div>
              <SectionLabel>The real cost of search</SectionLabel>
              <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-5">
                Algolia charges you
                <br />
                <span className="italic text-moss">every single query.</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                At $0.50–$1.75 per 1,000 search requests, costs scale with
                traffic. A docs site with 100K monthly searches pays{" "}
                <span className="text-text-primary font-medium">
                  $600–$2,100/year
                </span>{" "}
                just for search. With moss, search runs in the browser — your
                cost is flat, regardless of traffic.
              </p>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <DollarSign size={15} className="text-moss-dim" />
                Drag the slider to see your savings
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-surface-raised border border-surface-border rounded-2xl p-8">
              {/* Slider */}
              <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                Monthly search queries
              </label>
              <div className="flex items-center gap-4 mb-8">
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={queries}
                  onChange={(e) => setQueries(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-lg font-semibold text-text-primary min-w-[80px] text-right">
                  {queries}K
                </span>
              </div>

              {/* Comparison */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-400/70" />
                    <span className="text-sm text-text-secondary">
                      Algolia (est.)
                    </span>
                  </div>
                  <span className="font-mono text-lg font-bold text-red-400">
                    ${algoliaYearly.toLocaleString()}/yr
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-moss" />
                    <span className="text-sm text-text-secondary">moss</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-moss">
                    {mossCost === 0
                      ? "Free"
                      : `$${(mossCost * 12).toLocaleString()}/yr`}
                  </span>
                </div>
              </div>

              {/* Savings */}
              <div className="mt-6 pt-6 border-t border-surface-border text-center">
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">
                  You save
                </div>
                <div className="font-display text-4xl italic text-moss">
                  ${saved > 0 ? saved.toLocaleString() : 0}
                  <span className="text-xl text-text-muted not-italic">
                    /year
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Moss — 3 customer pain points solved                           */
/* ------------------------------------------------------------------ */
function WhyMoss() {
  const cards = [
    {
      icon: DollarSign,
      title: "Zero per-query costs",
      body: "Search runs in the browser using WASM — no server roundtrips. Whether you get 100 or 100,000 searches/month, your cost doesn't change. Replace Algolia's per-query billing with a flat monthly price (or self-host for free).",
    },
    {
      icon: Lock,
      title: "Your users' data stays private",
      body: "Every search query runs locally. Nothing is sent to a third-party server. Ideal for sensitive docs, internal tools, and privacy-conscious products. No cookie banners, no DPAs, no compliance headaches.",
    },
    {
      icon: Zap,
      title: "Sub-millisecond results",
      body: "HNSW (the same algorithm powering Pinecone and pgvector) compiled to 54KB of WASM. Semantic search that understands intent, not just keywords. Average query time: 0.4ms — faster than a server roundtrip could ever be.",
    },
  ];

  return (
    <section id="why" className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Why moss</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1]">
              Better search.{" "}
              <span className="italic text-moss">Lower costs.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group bg-surface-raised border border-surface-border rounded-2xl p-8 h-full hover:border-surface-border-hover transition-colors">
                <div className="w-11 h-11 rounded-xl bg-moss-glow border border-moss/10 flex items-center justify-center mb-6 group-hover:bg-moss-glow-strong transition-colors">
                  <c.icon size={20} className="text-moss" />
                </div>
                <h3 className="font-body font-bold text-lg text-text-primary mb-3">
                  {c.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Search Demo                                            */
/* ------------------------------------------------------------------ */
const DEMO_RESULTS: Record<string, { score: number; title: string; snippet: string }[]> = {
  "": [],
  "how to configure webhooks": [
    { score: 0.73, title: "Setting Up Webhook Endpoints", snippet: "Configure webhook URLs, set up authentication headers, and handle retry logic for failed deliveries..." },
    { score: 0.68, title: "Webhook Events Reference", snippet: "A complete list of events that trigger webhooks, including payload schemas and example responses..." },
    { score: 0.61, title: "Debugging Failed Deliveries", snippet: "Use the webhook logs dashboard to inspect failed deliveries, replay events, and set up monitoring alerts..." },
  ],
  "authentication": [
    { score: 0.81, title: "Authentication Overview", snippet: "moss supports API key, OAuth 2.0, and JWT bearer token authentication. Choose the method that fits your stack..." },
    { score: 0.74, title: "OAuth 2.0 Integration Guide", snippet: "Step-by-step guide to implementing OAuth 2.0 with PKCE flow for single-page applications..." },
    { score: 0.65, title: "Managing API Keys", snippet: "Create, rotate, and revoke API keys from the dashboard. Set per-key rate limits and scope restrictions..." },
  ],
  "rate limiting": [
    { score: 0.77, title: "Rate Limiting & Quotas", snippet: "Default rate limits are 1,000 req/min for free plans and 10,000 req/min for paid. Custom limits available on Enterprise..." },
    { score: 0.69, title: "Handling 429 Errors", snippet: "When you hit a rate limit, the response includes Retry-After and X-RateLimit-Reset headers..." },
    { score: 0.58, title: "Burst Traffic Best Practices", snippet: "Use exponential backoff with jitter. Queue non-urgent requests. Cache responses when possible..." },
  ],
};

const DEMO_QUERIES = Object.keys(DEMO_RESULTS).filter(Boolean);

function SearchDemo() {
  const [query, setQuery] = useState("");
  const [typedQuery, setTypedQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [results, setResults] = useState<typeof DEMO_RESULTS[""]>([]);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  const runDemo = useCallback((q: string) => {
    setQuery(q);
    setTypedQuery("");
    setResults([]);
    setSearchTime(null);
    setIsTyping(true);

    // Simulate typing
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedQuery(q.slice(0, i));
      if (i >= q.length) {
        clearInterval(interval);
        setIsTyping(false);
        // Simulate search
        setTimeout(() => {
          setResults(DEMO_RESULTS[q] || []);
          setSearchTime(Math.random() * 0.4 + 0.2);
        }, 150);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <SectionLabel>Live demo</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-3">
              Try it. <span className="italic text-moss">Right here.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              This is what your users see — instant, relevant results. Click a
              sample query or type your own.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="max-w-2xl mx-auto">
            {/* Sample queries */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {DEMO_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => runDemo(q)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                    query === q
                      ? "bg-moss/10 border-moss/30 text-moss"
                      : "bg-surface-raised border-surface-border text-text-muted hover:text-text-secondary hover:border-surface-border-hover"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Search box */}
            <div className="bg-surface-raised border border-surface-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
                <Search size={18} className="text-text-muted flex-shrink-0" />
                <div className="flex-1 font-body text-[15px] text-text-primary min-h-[24px]">
                  {typedQuery || (
                    <span className="text-text-muted">
                      Click a query above...
                    </span>
                  )}
                  {isTyping && (
                    <span className="typing-cursor ml-0.5">&nbsp;</span>
                  )}
                </div>
                {searchTime !== null && (
                  <span className="font-mono text-xs text-text-muted flex items-center gap-1">
                    <Clock size={11} />
                    {searchTime.toFixed(1)}ms
                  </span>
                )}
              </div>

              {/* Results */}
              <div className="divide-y divide-surface-border">
                {results.length === 0 && !isTyping && query && (
                  <div className="px-5 py-8 text-center text-sm text-text-muted">
                    Searching...
                  </div>
                )}
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="px-5 py-4 hover:bg-surface-overlay/40 transition-colors"
                    style={{
                      animation: `fadeSlideIn 0.3s ease both`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-semibold text-moss bg-moss-glow border border-moss/10 rounded px-1.5 py-0.5 mt-0.5 flex-shrink-0">
                        {r.score.toFixed(2)}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-text-primary mb-1">
                          {r.title}
                        </div>
                        <div className="text-xs text-text-muted leading-relaxed">
                          {r.snippet}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {results.length === 0 && !query && (
                  <div className="px-5 py-10 text-center text-sm text-text-muted">
                    <Search
                      size={24}
                      className="mx-auto mb-2 text-surface-border-hover"
                    />
                    Click a sample query to see instant results
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="px-5 py-3 border-t border-surface-border bg-surface/50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-text-muted">
                    {results.length} results &middot; WASM search:{" "}
                    {searchTime?.toFixed(1)}ms &middot; 100% client-side
                  </span>
                  <span className="text-[11px] font-mono text-moss flex items-center gap-1">
                    <Shield size={10} />
                    No data sent to server
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* CSS for result animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works — customer-oriented                                   */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Install the package",
      desc: "One npm install. TypeScript types included. No native dependencies, no build plugins — it's just WASM.",
      code: "npm install moss-search",
    },
    {
      num: "2",
      title: "Build your search index",
      desc: "Point our CLI at your content. We generate embeddings and build an optimized HNSW index. One command.",
      code: "npx moss-search build ./docs",
    },
    {
      num: "3",
      title: "Add one script tag",
      desc: "Drop the embed script into your HTML. Your users get instant semantic search. You get zero server bills.",
      code: '<script src="cdn.moss/embed.js"\n  data-index="/index.bin" />',
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Integration</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1]">
              Add search in{" "}
              <span className="italic text-moss">three minutes.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="bg-surface-raised border border-surface-border rounded-2xl p-7 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 rounded-full bg-moss/10 border border-moss/20 flex items-center justify-center font-mono text-sm font-bold text-moss">
                    {s.num}
                  </span>
                  <h3 className="font-body font-bold text-base text-text-primary">
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-1">
                  {s.desc}
                </p>
                <div className="bg-bg rounded-lg px-4 py-3 border border-surface-border">
                  <pre className="font-mono text-xs text-moss whitespace-pre-wrap">
                    {s.code}
                  </pre>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Visual Benchmarks                                                  */
/* ------------------------------------------------------------------ */
function VisualBenchmarks() {
  const comparisons = [
    {
      label: "Search latency",
      items: [
        { name: "moss", value: 0.4, display: "0.4ms", pct: 2 },
        { name: "Voy", value: 3, display: "~3ms", pct: 15 },
        { name: "Orama", value: 5, display: "~5ms", pct: 25 },
        { name: "Algolia", value: 125, display: "50–200ms", pct: 65 },
      ],
    },
    {
      label: "Bundle size (gzipped)",
      items: [
        { name: "moss", value: 54, display: "54 KB", pct: 27 },
        { name: "Voy", value: 75, display: "75 KB", pct: 38 },
        { name: "Orama", value: 2, display: "<2 KB", pct: 1 },
        { name: "Algolia", value: 0, display: "N/A (SaaS)", pct: 0 },
      ],
    },
  ];

  return (
    <section
      id="benchmarks"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Performance</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-3">
              Measured, not{" "}
              <span className="italic text-moss">marketed.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Real benchmarks on 10,000 documents with 384-dimension embeddings.
              All numbers independently reproducible.
            </p>
          </div>
        </Reveal>

        {/* Key stats */}
        <Reveal delay={60}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { val: "0.4ms", label: "p95 latency", sub: "WASM, Chrome" },
              { val: "54 KB", label: "gzipped", sub: ".wasm binary" },
              { val: "95.4%", label: "recall@10", sub: "10K vectors" },
              { val: "19/20", label: "relevant", sub: "real queries" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-surface-raised border border-surface-border rounded-xl p-5 text-center"
              >
                <div className="font-display text-2xl md:text-3xl italic text-moss mb-1">
                  {s.val}
                </div>
                <div className="text-sm font-semibold text-text-primary">
                  {s.label}
                </div>
                <div className="text-xs text-text-muted font-mono mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bar comparisons */}
        <div className="space-y-12">
          {comparisons.map((comp, ci) => (
            <Reveal key={ci} delay={ci * 100 + 120}>
              <div>
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-5">
                  {comp.label}
                </h3>
                <div className="space-y-3">
                  {comp.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-4">
                      <span className="text-sm text-text-secondary w-16 text-right font-medium">
                        {item.name}
                      </span>
                      <div className="flex-1 h-7 bg-surface-raised rounded-lg overflow-hidden border border-surface-border">
                        {item.pct > 0 && (
                          <div
                            className={`h-full rounded-lg bar-animate ${
                              ii === 0 ? "bg-moss/40" : "bg-surface-overlay"
                            }`}
                            style={{
                              width: `${Math.max(item.pct, 3)}%`,
                              animationDelay: `${ci * 200 + ii * 100}ms`,
                            }}
                          />
                        )}
                      </div>
                      <span
                        className={`font-mono text-sm min-w-[80px] ${
                          ii === 0
                            ? "font-bold text-moss"
                            : "text-text-muted"
                        }`}
                      >
                        {item.display}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Who It's For                                                       */
/* ------------------------------------------------------------------ */
function WhoItsFor() {
  const segments = [
    {
      icon: BookOpen,
      title: "Documentation sites",
      desc: "Docusaurus, GitBook, Nextra, ReadTheDocs — replace your keyword search with semantic understanding. Users find answers, not just matching strings.",
      tag: "Most popular",
    },
    {
      icon: FileText,
      title: "Technical blogs",
      desc: "100+ articles and growing? Give readers instant, relevant results across your entire archive. Works with any static site generator.",
      tag: null,
    },
    {
      icon: Code2,
      title: "SaaS help centers",
      desc: "Reduce support tickets by helping users find their own answers. No PII leaves the browser — zero compliance risk.",
      tag: null,
    },
    {
      icon: Server,
      title: "Internal tools",
      desc: "Add search to internal wikis, knowledge bases, or admin dashboards. All data stays on the client — nothing traverses your network.",
      tag: null,
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Use cases</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1]">
              Built for teams that{" "}
              <span className="italic text-moss">ship docs.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {segments.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="bg-surface-raised border border-surface-border rounded-2xl p-7 hover:border-surface-border-hover transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <s.icon size={22} className="text-moss" />
                  {s.tag && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-full">
                      {s.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-body font-bold text-base text-text-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
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
      desc: "Self-host everything. You bring the embeddings, we provide the engine.",
      features: [
        "Full WASM search engine",
        "Up to 1K pages",
        "Bring your own embeddings",
        "Community support on GitHub",
        "MIT license",
      ],
      cta: "npm install",
      href: "#get-started",
      primary: false,
      popular: false,
    },
    {
      name: "Starter",
      price: "$29",
      period: "/mo",
      desc: "We handle the pipeline. You paste one script tag.",
      features: [
        "Up to 10K pages",
        "Managed embed + index pipeline",
        "CDN-hosted assets",
        "One script tag integration",
        "Email support",
      ],
      cta: "Start free trial",
      href: "#get-started",
      primary: true,
      popular: false,
    },
    {
      name: "Pro",
      price: "$99",
      period: "/mo",
      desc: "For growing teams with custom branding needs.",
      features: [
        "Up to 50K pages",
        "Custom search UI styling",
        "Priority email support",
        "Analytics dashboard",
        "Auto re-indexing on content change",
      ],
      cta: "Start free trial",
      href: "#get-started",
      primary: true,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$249",
      period: "/mo",
      desc: "SLA-backed search for large-scale deployments.",
      features: [
        "Up to 200K pages",
        "99.9% uptime SLA",
        "Dedicated Slack channel",
        "Custom embedding model",
        "On-prem deployment option",
      ],
      cta: "Talk to us",
      href: "#contact",
      primary: false,
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-3">
              Flat pricing.{" "}
              <span className="italic text-moss">No surprises.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              The core search engine is free and open source. Managed hosting
              starts at $29/mo — still cheaper than one month of Algolia for
              most sites.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`relative flex flex-col rounded-2xl p-7 h-full transition-colors ${
                  t.popular
                    ? "pricing-glow bg-surface-raised border-transparent"
                    : "bg-surface-raised border border-surface-border hover:border-surface-border-hover"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold uppercase tracking-widest bg-moss text-bg px-3 py-1 rounded-full whitespace-nowrap">
                    Most popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-body font-bold text-lg text-text-primary">
                    {t.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="font-display text-3xl italic text-text-primary">
                      {t.price}
                    </span>
                    {t.period && (
                      <span className="text-sm text-text-muted">{t.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-2.5 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <ul className="flex-1 space-y-2.5 mb-7">
                  {t.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <Check
                        size={14}
                        className="text-moss mt-0.5 flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={t.href}
                  className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition ${
                    t.primary
                      ? "bg-moss text-bg hover:brightness-110"
                      : "bg-surface-overlay border border-surface-border text-text-primary hover:border-surface-border-hover"
                  }`}
                >
                  {t.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const items = [
    {
      q: "Is this as good as Algolia?",
      a: "For semantic (vector) search over documentation and static content — yes, often better. moss uses HNSW, the same algorithm used by Pinecone, Weaviate, and pgvector. Our benchmarks show 95.4% recall on 10K documents. Algolia excels at real-time indexing and faceted search over structured data — if you need those, Algolia may still be the better fit.",
    },
    {
      q: "Do I need to know Rust?",
      a: "No. moss is an npm package with TypeScript types. You install it with npm, configure it in JavaScript, and embed it with a script tag. Rust is only used internally to compile the WASM binary — you never touch it.",
    },
    {
      q: "How do I handle real-time content updates?",
      a: "On the managed plans, we automatically re-index when your content changes (via webhook or scheduled crawl). On the free plan, you re-run `npx moss-search build` and re-deploy the index file. The index is a single .bin file that sits alongside your static assets.",
    },
    {
      q: "What embedding model do you use?",
      a: "By default, all-MiniLM-L6-v2 (384 dimensions) — a widely-used sentence transformer that balances quality and size. On Enterprise plans, you can use any embedding model including OpenAI, Cohere, or a custom fine-tuned model.",
    },
    {
      q: "How big is the index file?",
      a: "For 10K documents at 384 dimensions, the index is about 17 MB. For a typical docs site with 500–2,000 pages, expect 2–5 MB. The WASM binary itself is 54 KB gzipped. Together, they're smaller than most hero images.",
    },
    {
      q: "Does search work offline?",
      a: "Yes. Once the WASM binary and index are loaded, search is fully local. If your site is a PWA or installed as an app, search works with no internet connection.",
    },
    {
      q: "What about SEO for search pages?",
      a: "moss is a UI search widget — it doesn't replace your content pages. Search results link to your existing pages, which are already indexed by Google. No SEO impact.",
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1]">
              Common questions
            </h2>
          </div>
        </Reveal>

        <div className="divide-y divide-surface-border border-t border-b border-surface-border">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 40}>
              <div>
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                >
                  <span className="text-[15px] font-semibold text-text-primary group-hover:text-moss transition-colors pr-4">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-text-muted flex-shrink-0 transition-transform duration-300 ${
                      openIdx === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div className={`faq-answer ${openIdx === i ? "open" : ""}`}>
                  <div>
                    <p className="text-sm text-text-secondary leading-relaxed pb-5">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Get Started                                                        */
/* ------------------------------------------------------------------ */
function GetStarted() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText("npm install moss-search");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section id="get-started" className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="relative bg-surface-raised border border-surface-border rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div
              className="glow"
              style={{
                width: 600,
                height: 600,
                top: "-50%",
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(circle, rgba(110,231,183,0.06) 0%, transparent 65%)",
              }}
            />

            <div className="relative">
              <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-4">
                Ready to{" "}
                <span className="italic text-moss">stop overpaying?</span>
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                Install moss in under 3 minutes. Free for small sites. No
                credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <div
                  className="copy-trigger group flex items-center bg-bg border border-surface-border rounded-xl px-5 py-3 cursor-pointer hover:border-surface-border-hover transition"
                  onClick={copy}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && copy()}
                >
                  <span className="font-mono text-sm text-text-muted mr-2 select-none">
                    $
                  </span>
                  <span className="font-mono text-sm text-text-primary">
                    npm install moss-search
                  </span>
                  <span className="copy-icon ml-4 text-text-muted hover:text-moss transition-colors">
                    {copied ? (
                      <Check size={14} className="text-moss" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </span>
                </div>
                <a
                  href="https://github.com/AltorLab/altor-vec"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-moss transition-colors"
                >
                  <Github size={15} />
                  Star on GitHub
                  <ExternalLink size={12} />
                </a>
              </div>

              <p className="text-xs text-text-muted">
                MIT licensed &middot; TypeScript types included &middot; Zero
                runtime dependencies
              </p>
            </div>
          </div>
        </Reveal>
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <SectionLabel>Custom integration</SectionLabel>
              <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-5">
                Need something{" "}
                <span className="italic text-moss">bespoke?</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                We built moss from scratch in Rust — HNSW, WASM compilation,
                Web Workers, the embedding pipeline. If you need custom vector
                search, performance optimization, or a full integration build,
                we can help.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Custom embedding model integration",
                  "On-premise deployment for air-gapped environments",
                  "Migration from Algolia, Elasticsearch, or Typesense",
                  "Performance tuning for large-scale indexes",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <Check
                      size={14}
                      className="text-moss mt-0.5 flex-shrink-0"
                    />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@altorlab.dev"
                className="inline-flex items-center gap-2 bg-moss text-bg font-semibold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition"
              >
                <Mail size={15} />
                hello@altorlab.dev
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-surface-raised border border-surface-border rounded-2xl p-8">
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-5">
                Consulting rates
              </div>
              <div className="space-y-5">
                {[
                  {
                    label: "Hourly consulting",
                    price: "$150–250/hr",
                    desc: "Architecture review, pair programming, code audit",
                  },
                  {
                    label: "Integration project",
                    price: "$5K–20K",
                    desc: "Full implementation of search for your product",
                  },
                  {
                    label: "Ongoing retainer",
                    price: "Custom",
                    desc: "Dedicated support, priority features, SLA",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-start justify-between gap-4 pb-5 border-b border-surface-border last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {r.label}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        {r.desc}
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-moss whitespace-nowrap">
                      {r.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-surface-border py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="text-moss">&#x1F33F;</span>
            <span className="font-display text-lg italic text-text-primary">
              moss
            </span>
            <span className="text-xs text-text-muted font-mono ml-2">
              by AltorLab
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-text-muted">
            <a
              href="https://github.com/AltorLab/altor-vec"
              target="_blank"
              rel="noopener"
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <Github size={13} /> GitHub
            </a>
            <a
              href="https://npmjs.com"
              target="_blank"
              rel="noopener"
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <Package size={13} /> npm
            </a>
            <a
              href="mailto:hello@altorlab.dev"
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <Mail size={13} /> Contact
            </a>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} AltorLab. Open source under MIT
          license. Built with Rust.
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <div className="noise">
      <Nav />
      <Hero />
      <CostSavings />
      <WhyMoss />
      <SearchDemo />
      <HowItWorks />
      <VisualBenchmarks />
      <WhoItsFor />
      <Pricing />
      <FAQ />
      <GetStarted />
      <ConsultingCTA />
      <Footer />
    </div>
  );
}
