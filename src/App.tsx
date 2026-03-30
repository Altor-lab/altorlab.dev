import init, { WasmSearchEngine } from "altor-vec";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Copy,
  Cpu,
  DollarSign,
  ExternalLink,
  FileText,
  Github,
  Lock,
  Mail,
  Menu,
  Package,
  Search,
  Server,
  Shield,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_QUERIES } from "./demo-data";
import EmbedWorker from "./embed-worker?worker";

const INSTALL_COMMAND = "npm install altor-vec";
const GITHUB_URL = "https://github.com/altor-lab/altor-vec";
const NPM_URL = "https://www.npmjs.com/package/altor-vec";
const CONTACT_EMAIL = "anshul@altorlab.com";

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
    <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-altor-dim mb-4">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Code Block                                                         */
/* ------------------------------------------------------------------ */
function CodeBlock({
  code,
  filename,
  copyText,
}: {
  code: React.ReactNode;
  filename?: string;
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [copyText]);

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dot bg-red-500/60" />
        <div className="code-block-dot bg-amber/60" />
        <div className="code-block-dot bg-altor-deep/80" />
        {filename && (
          <span className="ml-2 font-mono text-[11px] text-text-muted flex-1">
            {filename}
          </span>
        )}
        {copyText && (
          <button
            type="button"
            onClick={copy}
            className="ml-auto text-text-muted hover:text-altor transition-colors p-0.5"
            title="Copy code"
          >
            {copied ? (
              <Check size={13} className="text-altor" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        )}
      </div>
      <pre className="font-mono text-[13px] leading-relaxed p-5 overflow-x-auto text-text-secondary whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CopyButton                                                         */
/* ------------------------------------------------------------------ */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      className="copy-trigger group flex items-center bg-surface-raised border border-surface-border rounded-xl px-5 py-3 cursor-pointer hover:border-surface-border-hover transition"
      onClick={copy}
      onKeyDown={(e) => e.key === "Enter" && copy()}
    >
      <span className="font-mono text-sm text-text-muted mr-2 select-none">
        $
      </span>
      <span className="font-mono text-sm text-text-primary">{text}</span>
      <span className="copy-icon ml-4 text-text-muted hover:text-altor transition-colors">
        {copied ? (
          <Check size={14} className="text-altor" />
        ) : (
          <Copy size={14} />
        )}
      </span>
    </button>
  );
}

function ConversionBar() {
  return (
    <div className="sticky top-0 z-[70] border-b border-altor/10 bg-bg/95 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-3 text-center text-[11px] md:text-[12px] font-mono text-text-secondary">
        <span className="text-text-primary font-semibold">Try it now:</span>
        <a
          href={NPM_URL}
          target="_blank"
          rel="noopener"
          className="text-altor hover:text-altor-dim transition-colors"
        >
          {INSTALL_COMMAND}
        </a>
        <span className="hidden md:inline text-surface-border-hover">|</span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener"
          className="text-text-primary hover:text-altor transition-colors"
        >
          ⭐ Star on GitHub
        </a>
        <span className="hidden md:inline text-surface-border-hover">|</span>
        <span>54KB • Sub-millisecond • No server needed</span>
      </div>
    </div>
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
      className={`fixed inset-x-0 top-11 md:top-12 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-2xl border-b border-surface-border"
          : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="font-mono text-[18px] font-bold text-altor tracking-tight">
            altor-vec
          </span>
        </button>

        <div className="hidden md:flex items-center gap-7">
          <a href="#why" className={linkClass}>
            Why altor-vec
          </a>
          <a href="#demo" className={linkClass}>
            Demo
          </a>
          <a
            href="https://github.com/altor-lab/altor-vec#readme"
            target="_blank"
            rel="noopener"
            className={linkClass}
          >
            Docs
          </a>
          <a
            href="https://www.npmjs.com/package/altor-vec"
            target="_blank"
            rel="noopener"
            className={`${linkClass} flex items-center gap-1.5`}
          >
            <Package size={13} />
            npm
          </a>
          <a
            href="https://github.com/altor-lab/altor-vec"
            target="_blank"
            rel="noopener"
            className={`${linkClass} flex items-center gap-1.5`}
          >
            <Github size={13} />
            GitHub
          </a>
          <a
            href="#get-started"
            className="text-[13px] font-semibold bg-altor text-bg px-4 py-2 rounded-lg hover:brightness-110 transition"
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          className="md:hidden text-text-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-b border-surface-border px-6 pb-5 pt-1 flex flex-col gap-3.5">
          {["Why altor-vec", "Demo", "Docs"].map((t) => (
            <a
              key={t}
              href={`#${t.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-text-secondary"
              onClick={() => setOpen(false)}
            >
              {t}
            </a>
          ))}
          <a
            href="https://github.com/altor-lab/altor-vec"
            target="_blank"
            rel="noopener"
            className="text-sm text-text-secondary flex items-center gap-1.5"
            onClick={() => setOpen(false)}
          >
            <Github size={13} /> GitHub
          </a>
          <button
            type="button"
            className="text-sm font-semibold text-altor"
            onClick={() => {
              setOpen(false);
              document
                .getElementById("get-started")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-grid" />
      <div
        className="glow blob-morph"
        style={{
          width: 700,
          height: 700,
          top: "-15%",
          left: "50%",
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
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 pt-36 md:pt-40 pb-24 text-center">
        <Reveal>
          <a
            href="https://github.com/altor-lab/altor-vec"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-altor-glow border border-altor/10 rounded-full px-3.5 py-1 mb-7 hover:bg-altor-glow-strong transition-colors"
          >
            <Github size={11} className="text-altor" />
            <span className="text-[11px] font-mono font-medium text-text-secondary tracking-wide">
              Open source &middot; MIT license &middot; Built with Rust
            </span>
            <ExternalLink size={10} className="text-text-muted" />
          </a>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] mb-6">
            Stop paying
            <br />
            <span className="italic text-altor">per search query.</span>
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            <span className="text-text-primary font-medium">altor-vec</span>{" "}
            is an HNSW vector search engine compiled to{" "}
            <span className="text-text-primary font-medium">
              54KB of WebAssembly
            </span>
            . Search 10,000 vectors in under 1ms — entirely in the browser.
            No server. No API keys. No per-query billing.
          </p>
        </Reveal>

        <Reveal delay={180}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
              <CopyButton text={INSTALL_COMMAND} />
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 border border-surface-border text-text-primary font-semibold text-sm px-6 py-3 rounded-xl hover:border-surface-border-hover hover:text-altor transition"
            >
              <Github size={14} />
              View on GitHub
              <ArrowRight size={13} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12">
            {[
              "54 KB gzipped",
              "< 1ms search",
              "Zero server costs",
              "Data never leaves browser",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-[13px] text-text-muted"
              >
                <Check size={13} className="text-altor" />
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Code preview — centered below */}
        <Reveal delay={280}>
          <div className="max-w-lg mx-auto text-left">
            <CodeBlock
              filename="quickstart.js"
              copyText={`import init, { WasmSearchEngine } from 'altor-vec';

await init();
const resp = await fetch('/index.bin');
const engine = new WasmSearchEngine(
  new Uint8Array(await resp.arrayBuffer())
);

const results = JSON.parse(
  engine.search(queryVector, 5)
);
// => [[id, distance], ...] in <1ms`}
              code={
                <>
                  <span className="text-text-muted">
                    {"// 5 lines. No server. No API key.\n"}
                  </span>
                  <span style={{ color: "#c792ea" }}>{"import "}</span>
                  <span style={{ color: "#82aaff" }}>{"init"}</span>
                  <span style={{ color: "#c792ea" }}>{", { "}</span>
                  <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
                  <span style={{ color: "#c792ea" }}>{" } "}</span>
                  <span style={{ color: "#c792ea" }}>{"from "}</span>
                  <span style={{ color: "#c3e88d" }}>{`'altor-vec';\n\n`}</span>
                  <span style={{ color: "#c792ea" }}>{"await "}</span>
                  <span style={{ color: "#82aaff" }}>{"init"}</span>
                  {"();\n"}
                  <span style={{ color: "#c792ea" }}>{"const "}</span>
                  {"resp "}
                  <span style={{ color: "#c792ea" }}>{"= await "}</span>
                  <span style={{ color: "#82aaff" }}>{"fetch"}</span>
                  {"("}
                  <span style={{ color: "#c3e88d" }}>{`'/index.bin'`}</span>
                  {");\n"}
                  <span style={{ color: "#c792ea" }}>{"const "}</span>
                  {"engine "}
                  <span style={{ color: "#c792ea" }}>{"= new "}</span>
                  <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
                  {
                    "(\n  new Uint8Array(await resp.arrayBuffer())\n);\n\n"
                  }
                  <span style={{ color: "#c792ea" }}>{"const "}</span>
                  {"results "}
                  <span style={{ color: "#c792ea" }}>{"= "}</span>
                  {"JSON."}
                  <span style={{ color: "#82aaff" }}>{"parse"}</span>
                  {"(\n  engine."}
                  <span style={{ color: "#82aaff" }}>{"search"}</span>
                  {"(queryVector, "}
                  <span style={{ color: "#f78c6c" }}>{"5"}</span>
                  {")\n);\n"}
                  <span className="text-text-muted">
                    {"// => [[id, distance], ...] in <1ms"}
                  </span>
                </>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const body = trimmedEmail
      ? `Please add me to the altor-vec mailing list.\n\nEmail: ${trimmedEmail}`
      : "Please add me to the altor-vec mailing list";

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("altor-vec updates signup")}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <section className="py-16 border-t border-surface-border bg-surface/30">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="bg-surface-raised border border-surface-border rounded-3xl p-8 md:p-10 text-center">
            <SectionLabel>Stay updated</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.3rem] leading-[1.1] mb-3">
              Get notified about new features and tutorials
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto mb-7">
              Leave your email and your mail app opens with a pre-filled signup request.
            </p>

            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email input"
                className="flex-1 rounded-xl border border-surface-border bg-bg px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-altor"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-altor px-6 py-3 text-sm font-semibold text-bg hover:brightness-110 transition"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-4 text-xs text-text-muted">
              {submitted ? "Opening your email client…" : `Or email ${CONTACT_EMAIL} directly.`}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SocialProofSection() {
  const useCases = [
    "Semantic search for e-commerce",
    "Offline-first applications",
    "Browser-based RAG systems",
    "Privacy-preserving search",
  ];

  const proofPoints = [
    "54KB bundle",
    "<1ms queries",
    "0 server dependencies",
    "MIT licensed",
  ];

  return (
    <section className="py-20 border-t border-surface-border">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            <div className="bg-surface-raised border border-surface-border rounded-3xl p-8 md:p-10">
              <SectionLabel>Social proof</SectionLabel>
              <h2 className="font-display text-3xl md:text-[2.4rem] leading-[1.1] mb-5">
                Used by developers building:
              </h2>
              <ul className="space-y-3 mb-6">
                {useCases.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-text-secondary"
                  >
                    <Check size={16} className="text-altor mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                {proofPoints.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-altor/15 bg-altor-glow px-3 py-1.5 text-xs font-mono text-text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-bg border border-surface-border rounded-3xl p-8">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted mb-4">
                What converts
              </p>
              <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                <p>
                  Show the install command, prove the speed, and reduce trust friction.
                </p>
                <p>
                  altor-vec already demonstrates the product live in-browser, so this section reinforces why developers adopt it.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-surface-border">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-altor hover:text-altor-dim transition-colors"
                >
                  <Github size={15} />
                  See the repo developers star
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonCallout() {
  const rows = [
    ["Bundle", "54KB", "N/A (API calls)"],
    ["Latency", "<1ms", "50-200ms"],
    ["Cost", "Free", "$70+/mo"],
    ["Privacy", "Data stays in browser", "Data sent to server"],
  ];

  return (
    <section className="py-20 border-t border-surface-border bg-surface/30">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <SectionLabel>Why altor-vec?</SectionLabel>
              <h2 className="font-display text-3xl md:text-[2.4rem] leading-[1.1]">
                Client-side vector search without the server tax
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-surface-border bg-surface-raised">
              <table className="w-full text-left">
                <thead className="bg-bg/70 border-b border-surface-border">
                  <tr>
                    <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-text-muted">
                      Feature
                    </th>
                    <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-altor">
                      altor-vec
                    </th>
                    <th className="px-5 py-4 text-xs font-mono uppercase tracking-wider text-text-muted">
                      Server-side (Pinecone)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([feature, altorValue, serverValue]) => (
                    <tr key={feature} className="border-t border-surface-border first:border-0">
                      <td className="px-5 py-4 text-sm font-semibold text-text-primary">
                        {feature}
                      </td>
                      <td className="px-5 py-4 text-sm text-altor">{altorValue}</td>
                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {serverValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Open Source Credibility                                            */
/* ------------------------------------------------------------------ */
function OpenSourceSection() {
  return (
    <section className="py-20 border-t border-surface-border">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <SectionLabel>Open source</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.1]">
              Open source. Built in Rust.{" "}
              <span className="italic text-altor">Ships as WASM.</span>
            </h2>
          </div>
        </Reveal>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            {
              val: "54KB",
              label: "gzipped WASM",
              sub: "117KB raw .wasm binary",
            },
            {
              val: "< 1ms",
              label: "p95 latency",
              sub: "10K vectors, Chrome",
            },
            {
              val: "$0/query",
              label: "per-query cost",
              sub: "forever, no server",
            },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <div className="stat-card">
                <div className="font-display text-3xl md:text-4xl italic text-altor mb-2">
                  {s.val}
                </div>
                <div className="text-sm font-semibold text-text-primary">
                  {s.label}
                </div>
                <div className="text-xs text-text-muted font-mono mt-1">
                  {s.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Architecture + links */}
        <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          <Reveal>
            <div>
              <p className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4">
                Source architecture
              </p>
              <CodeBlock
                filename="src/"
                code={
                  <>
                    <span className="text-text-muted">{"src/\n"}</span>
                    <span style={{ color: "#c792ea" }}>{"├── "}</span>
                    <span style={{ color: "#82aaff" }}>{"lib.rs"}</span>
                    <span className="text-text-muted">
                      {"              # Public API re-exports\n"}
                    </span>
                    <span style={{ color: "#c792ea" }}>{"├── "}</span>
                    <span style={{ color: "#82aaff" }}>{"distance.rs"}</span>
                    <span className="text-text-muted">
                      {"       # Dot product, auto-vectorizes SIMD\n"}
                    </span>
                    <span style={{ color: "#c792ea" }}>{"└── "}</span>
                    <span style={{ color: "#6ee7b7" }}>{"hnsw/"}</span>
                    {"\n"}
                    <span style={{ color: "#c792ea" }}>{"    ├── "}</span>
                    <span style={{ color: "#82aaff" }}>{"mod.rs"}</span>
                    <span className="text-text-muted">
                      {"          # API + serialization\n"}
                    </span>
                    <span style={{ color: "#c792ea" }}>{"    ├── "}</span>
                    <span style={{ color: "#82aaff" }}>{"graph.rs"}</span>
                    <span className="text-text-muted">
                      {"        # Layered graph structure\n"}
                    </span>
                    <span style={{ color: "#c792ea" }}>{"    ├── "}</span>
                    <span style={{ color: "#82aaff" }}>{"search.rs"}</span>
                    <span className="text-text-muted">
                      {"       # Greedy beam search\n"}
                    </span>
                    <span style={{ color: "#c792ea" }}>{"    └── "}</span>
                    <span style={{ color: "#82aaff" }}>{"construction.rs"}</span>
                    <span className="text-text-muted">
                      {"  # Insert + layer selection\n"}
                    </span>
                    {"\n"}
                    <span className="text-text-muted">{"wasm/\n"}</span>
                    <span style={{ color: "#c792ea" }}>{"└── "}</span>
                    <span style={{ color: "#82aaff" }}>{"src/lib.rs"}</span>
                    <span className="text-text-muted">
                      {"       # wasm-bindgen wrapper"}
                    </span>
                  </>
                }
              />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-5">
              <div className="bg-surface-raised border border-surface-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu size={18} className="text-altor" />
                  <span className="font-semibold text-text-primary text-sm">
                    Why Rust + WASM?
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Rust compiles to highly optimized WASM with SIMD distance
                  calculations. The same HNSW algorithm used by Pinecone,
                  Weaviate, and pgvector — now running at near-native speed
                  inside your users' browsers.
                </p>
              </div>

              <div className="bg-surface-raised border border-surface-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={18} className="text-altor" />
                  <span className="font-semibold text-text-primary text-sm">
                    Zero data egress
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Search runs entirely locally. No query is ever sent to a
                  server. No third-party SDK. No cookie banners. No DPAs.
                  Perfect for privacy-sensitive content.
                </p>
              </div>

              <a
                href="https://github.com/altor-lab/altor-vec"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 text-sm font-semibold text-altor hover:text-altor-dim transition-colors"
              >
                <Github size={15} />
                Read the source on GitHub
                <ArrowRight size={13} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why altor-vec — 3 value props                                     */
/* ------------------------------------------------------------------ */
function WhyAltorVec() {
  const cards = [
    {
      icon: DollarSign,
      title: "Zero per-query costs",
      body: "Search runs in the browser using WASM — no server roundtrips. Whether you get 100 or 1,000,000 searches/month, your cost doesn't change. Self-host for free or use our managed pipeline.",
    },
    {
      icon: Lock,
      title: "Your users' data stays private",
      body: "Every search query runs locally. Nothing is sent to a third-party server. Ideal for sensitive docs, internal tools, and privacy-conscious products. No cookie banners, no DPAs, no compliance headaches.",
    },
    {
      icon: Zap,
      title: "Sub-millisecond results",
      body: "HNSW compiled to 54KB of WASM. Semantic search that understands intent, not just keywords. p95 query time: 0.6ms in Chrome — faster than a network roundtrip could ever be.",
    },
  ];

  return (
    <section
      id="why"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Why altor-vec</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1]">
              Better search.{" "}
              <span className="italic text-altor">Lower costs.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="group bg-surface-raised border border-surface-border rounded-2xl p-8 h-full hover:border-surface-border-hover transition-colors">
                <div className="w-11 h-11 rounded-xl bg-altor-glow border border-altor/10 flex items-center justify-center mb-6 group-hover:bg-altor-glow-strong transition-colors">
                  <c.icon size={20} className="text-altor" />
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
/*  Live WASM Search Demo                                              */
/* ------------------------------------------------------------------ */
interface Passage {
  id: number;
  text: string;
}

type ModelState = "idle" | "downloading" | "ready" | "error";

function LiveSearchDemo() {
  const [engineState, setEngineState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [engine, setEngine] = useState<WasmSearchEngine | null>(null);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [results, setResults] = useState<
    { rank: number; text: string; distance: number }[]
  >([]);
  const [searchLatency, setSearchLatency] = useState<number | null>(null);
  const [embedLatency, setEmbedLatency] = useState<number | null>(null);
  const [modelState, setModelState] = useState<ModelState>("idle");
  const [modelProgress, setModelProgress] = useState("");
  const [embedding, setEmbedding] = useState(false);
  const engineRef = useRef<WasmSearchEngine | null>(null);
  const passagesRef = useRef<Passage[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const embedResolveRef = useRef<((vec: number[]) => void) | null>(null);
  const embedTimeRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load WASM engine + metadata on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await init();
        const [indexResp, metaResp] = await Promise.all([
          fetch("/demo-index.bin"),
          fetch("/metadata.json"),
        ]);
        if (!indexResp.ok) throw new Error("Failed to fetch index");
        if (!metaResp.ok) throw new Error("Failed to fetch metadata");
        const [bytes, passages] = await Promise.all([
          indexResp.arrayBuffer().then((b) => new Uint8Array(b)),
          metaResp.json() as Promise<Passage[]>,
        ]);
        const eng = new WasmSearchEngine(bytes);
        if (cancelled) {
          eng.free();
          return;
        }
        engineRef.current = eng;
        passagesRef.current = passages;
        setEngine(eng);
        setEngineState("ready");
      } catch (e) {
        console.error("altor-vec init failed:", e);
        if (!cancelled) setEngineState("error");
      }
    }
    load();
    return () => {
      cancelled = true;
      engineRef.current?.free();
    };
  }, []);

  // Start embed worker once engine is ready
  useEffect(() => {
    if (engineState !== "ready") return;
    const worker = new EmbedWorker();
    workerRef.current = worker;
    setModelState("downloading");
    setModelProgress("Loading embedding model...");

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === "progress") {
        if (msg.status === "progress" && msg.file) {
          const pct = msg.progress != null ? Math.round(msg.progress) : null;
          setModelProgress(
            pct != null
              ? `Downloading model... ${pct}%`
              : `Downloading ${msg.file}...`
          );
        }
      } else if (msg.type === "ready") {
        setModelState("ready");
        setModelProgress("");
      } else if (msg.type === "embedding") {
        if (embedResolveRef.current) {
          embedResolveRef.current(msg.vector);
          embedResolveRef.current = null;
        }
      } else if (msg.type === "error") {
        console.error("Embed worker error:", msg.message);
        setModelState("error");
        setModelProgress("Embedding model failed to load");
        if (embedResolveRef.current) {
          embedResolveRef.current([]);
          embedResolveRef.current = null;
        }
      }
    };

    worker.postMessage({ type: "init" });

    return () => {
      worker.terminate();
    };
  }, [engineState]);

  // Auto-focus input when engine becomes ready
  useEffect(() => {
    if (engineState === "ready") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [engineState]);

  const embedText = useCallback((text: string): Promise<number[]> => {
    return new Promise((resolve) => {
      embedResolveRef.current = resolve;
      embedTimeRef.current = performance.now();
      workerRef.current?.postMessage({ type: "embed", text, id: Date.now() });
    });
  }, []);

  const searchWithVector = useCallback(
    (q: string, vec: number[], embedMs: number | null) => {
      const eng = engineRef.current;
      if (!eng || vec.length === 0) return;

      const t0 = performance.now();
      const raw: [number, number][] = JSON.parse(
        eng.search(new Float32Array(vec), 5)
      );
      const searchMs = performance.now() - t0;

      setSearchLatency(searchMs);
      setEmbedLatency(embedMs);
      setActiveQuery(q);
      setResults(
        raw.map(([id, distance], i) => {
          const passage = passagesRef.current[id];
          return {
            rank: i + 1,
            text: passage?.text ?? `Passage ${id}`,
            distance,
          };
        })
      );
    },
    []
  );

  const runQuery = useCallback(
    async (q: string, precomputed?: number[]) => {
      if (!engineRef.current || !q.trim()) return;

      if (precomputed) {
        searchWithVector(q, precomputed, null);
        return;
      }

      if (modelState !== "ready") return;

      setEmbedding(true);
      const t0 = performance.now();
      const vec = await embedText(q);
      const embedMs = performance.now() - t0;
      setEmbedding(false);

      if (vec.length > 0) {
        searchWithVector(q, vec, embedMs);
      }
    },
    [modelState, embedText, searchWithVector]
  );

  // Debounced auto-search when model is ready and user types
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (modelState === "ready" && value.trim()) {
        debounceRef.current = setTimeout(() => {
          runQuery(value);
        }, 300);
      }
    },
    [modelState, runQuery]
  );

  const chipsEnabled = engineState === "ready";
  const inputEnabled = engineState === "ready";

  return (
    <section
      id="demo"
      className="py-24 md:py-32 border-t border-surface-border bg-surface/40"
    >
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <SectionLabel>Live demo</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-3">
              Try it.{" "}
              <span className="italic text-altor">Right here.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              10,000 real passages searched by semantic similarity — embeddings
              and retrieval both run in your browser. No server is contacted.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="max-w-2xl mx-auto">
            {/* Engine status bar */}
            <div className="flex flex-col items-center gap-1 mb-5 min-h-[3rem]">
              {engineState === "loading" && (
                <span className="text-xs font-mono text-text-muted flex items-center gap-2">
                  <div className="live-dot opacity-50" />
                  Loading WASM engine...
                </span>
              )}
              {engineState === "ready" && (
                <span className="text-xs font-mono text-altor flex items-center gap-2">
                  <div className="live-dot" />
                  WASM engine running — {engine?.len().toLocaleString()} vectors
                </span>
              )}
              {engineState === "error" && (
                <span className="text-xs font-mono text-red-400">
                  Failed to load engine. Try refreshing.
                </span>
              )}
              {modelState === "downloading" && (
                <span className="text-xs font-mono text-text-muted flex items-center gap-2">
                  <svg
                    className="animate-spin h-3 w-3 text-altor"
                    viewBox="0 0 24 24"
                  >
                    <title>Loading embedding model</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {modelProgress}
                </span>
              )}
              {modelState === "ready" && (
                <span className="text-xs font-mono text-altor/70 flex items-center gap-1">
                  <Check size={10} />
                  Embedding model ready — type any query
                </span>
              )}
              {modelState === "error" && (
                <span className="text-xs font-mono text-amber-400">
                  {modelProgress || "Embedding model unavailable"} — try a
                  suggested query
                </span>
              )}
            </div>

            {/* Sample queries — always visible */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {DEMO_QUERIES.map((dq) => (
                <button
                  type="button"
                  key={dq.query}
                  disabled={!chipsEnabled}
                  onClick={() => {
                    setQuery(dq.query);
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    runQuery(dq.query, dq.vector);
                  }}
                  className={`tab-btn disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeQuery === dq.query ? "active" : ""
                  }`}
                >
                  {dq.query}
                </button>
              ))}
            </div>

            {/* Search box */}
            <div className="bg-surface-raised border border-surface-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
                {embedding ? (
                  <svg
                    className="animate-spin h-[18px] w-[18px] text-altor flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <title>Embedding query</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <Search
                    size={18}
                    className="text-text-muted flex-shrink-0"
                  />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputEnabled) {
                      if (debounceRef.current)
                        clearTimeout(debounceRef.current);
                      runQuery(query);
                    }
                  }}
                  placeholder={
                    modelState === "ready"
                      ? "Search 10,000 passages — type anything..."
                      : "Click a suggestion, or wait for model to load..."
                  }
                  disabled={!inputEnabled}
                  className="flex-1 bg-transparent font-body text-[15px] text-text-primary outline-none placeholder:text-text-muted disabled:opacity-40"
                />
                {searchLatency !== null && (
                  <span className="font-mono text-xs text-text-muted flex items-center gap-1 flex-shrink-0">
                    <Clock size={11} />
                    {embedLatency != null
                      ? `${embedLatency.toFixed(0)}ms + ${searchLatency < 0.1 ? "<0.1" : searchLatency.toFixed(1)}ms`
                      : searchLatency < 0.1
                        ? "< 0.1ms"
                        : `${searchLatency.toFixed(2)}ms`}
                  </span>
                )}
              </div>

              <div className="divide-y divide-surface-border">
                {results.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-text-muted">
                    <Search
                      size={24}
                      className="mx-auto mb-2 text-surface-border-hover"
                    />
                    {engineState === "ready"
                      ? "Click a sample query or type your own"
                      : "Loading WASM engine..."}
                  </div>
                )}
                {results.map((r, i) => (
                  <div
                    key={`${activeQuery}-${r.rank}-${r.text.slice(0, 24)}`}
                    className="px-5 py-4 hover:bg-surface-overlay/40 transition-colors"
                    style={{
                      animation: "fadeSlideIn 0.3s ease both",
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                        <span className="font-mono text-[10px] font-bold text-text-muted">
                          #{r.rank}
                        </span>
                        <span className="font-mono text-xs font-semibold text-altor bg-altor-glow border border-altor/10 rounded px-1.5 py-0.5">
                          {(1 - r.distance).toFixed(3)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-text-primary leading-relaxed">
                          {r.text.length > 200
                            ? `${r.text.slice(0, 200)}...`
                            : r.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.length > 0 && (
                <div className="px-5 py-3 border-t border-surface-border bg-surface/50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-text-muted">
                    {results.length} results &middot;{" "}
                    {embedLatency != null
                      ? `embed: ${embedLatency.toFixed(0)}ms + search: ${searchLatency !== null ? (searchLatency < 0.1 ? "<0.1ms" : `${searchLatency.toFixed(2)}ms`) : "—"}`
                      : `search: ${searchLatency !== null ? (searchLatency < 0.1 ? "<0.1ms" : `${searchLatency.toFixed(2)}ms`) : "—"}`}
                  </span>
                  <span className="text-[11px] font-mono text-altor flex items-center gap-1">
                    <Shield size={10} />
                    100% client-side — no server contacted
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

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
/*  Integrate in Minutes — tabbed code examples                       */
/* ------------------------------------------------------------------ */
function IntegrateInMinutes() {
  const [tab, setTab] = useState(0);

  const tabs = [
    {
      label: "Quick Start",
      filename: "main.js",
      copyText: `import init, { WasmSearchEngine } from 'altor-vec';

await init();

// Load a pre-built index
const resp = await fetch('/index.bin');
const engine = new WasmSearchEngine(
  new Uint8Array(await resp.arrayBuffer())
);

// Search returns in < 1ms
const results = JSON.parse(
  engine.search(queryVector, 5)
);
// => [[nodeId, distance], ...]`,
      code: (
        <>
          <span style={{ color: "#c792ea" }}>{"import "}</span>
          <span style={{ color: "#82aaff" }}>{"init"}</span>
          <span style={{ color: "#c792ea" }}>{", { "}</span>
          <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
          <span style={{ color: "#c792ea" }}>{" } "}</span>
          <span style={{ color: "#c792ea" }}>{"from "}</span>
          <span style={{ color: "#c3e88d" }}>{`'altor-vec';\n\n`}</span>
          <span style={{ color: "#c792ea" }}>{"await "}</span>
          <span style={{ color: "#82aaff" }}>{"init"}</span>
          {"();\n\n"}
          <span className="text-text-muted">{"// Load a pre-built index\n"}</span>
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"resp "}
          <span style={{ color: "#c792ea" }}>{"= await "}</span>
          <span style={{ color: "#82aaff" }}>{"fetch"}</span>
          {"("}
          <span style={{ color: "#c3e88d" }}>{`'/index.bin'`}</span>
          {");\n"}
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"engine "}
          <span style={{ color: "#c792ea" }}>{"= new "}</span>
          <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
          {"(\n  new Uint8Array(await resp."}
          <span style={{ color: "#82aaff" }}>{"arrayBuffer"}</span>
          {"())\n);\n\n"}
          <span className="text-text-muted">{"// Search returns in < 1ms\n"}</span>
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"results "}
          <span style={{ color: "#c792ea" }}>{"= "}</span>
          {"JSON."}
          <span style={{ color: "#82aaff" }}>{"parse"}</span>
          {"(\n  engine."}
          <span style={{ color: "#82aaff" }}>{"search"}</span>
          {"(queryVector, "}
          <span style={{ color: "#f78c6c" }}>{"5"}</span>
          {")\n);\n"}
          <span className="text-text-muted">{"// => [[nodeId, distance], ...]"}</span>
        </>
      ),
    },
    {
      label: "Web Worker",
      filename: "worker.js",
      copyText: `import init, { WasmSearchEngine } from 'altor-vec';

let engine;
self.onmessage = async (e) => {
  if (e.data.type === 'init') {
    await init();
    const resp = await fetch(e.data.indexUrl);
    engine = new WasmSearchEngine(
      new Uint8Array(await resp.arrayBuffer())
    );
    postMessage({ type: 'ready', count: engine.len() });
  }
  if (e.data.type === 'search') {
    const results = JSON.parse(
      engine.search(new Float32Array(e.data.query), e.data.topK)
    );
    postMessage({ type: 'results', results });
  }
};`,
      code: (
        <>
          <span style={{ color: "#c792ea" }}>{"import "}</span>
          <span style={{ color: "#82aaff" }}>{"init"}</span>
          <span style={{ color: "#c792ea" }}>{", { "}</span>
          <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
          <span style={{ color: "#c792ea" }}>{" } "}</span>
          <span style={{ color: "#c792ea" }}>{"from "}</span>
          <span style={{ color: "#c3e88d" }}>{`'altor-vec';\n\n`}</span>
          <span style={{ color: "#c792ea" }}>{"let "}</span>
          {"engine;\n"}
          {"self."}
          <span style={{ color: "#82aaff" }}>{"onmessage"}</span>
          {" = "}
          <span style={{ color: "#c792ea" }}>{"async "}</span>
          {"(e) => {\n"}
          {"  "}
          <span style={{ color: "#c792ea" }}>{"if "}</span>
          {"(e.data.type === "}
          <span style={{ color: "#c3e88d" }}>{`'init'`}</span>
          {") {\n"}
          {"    "}
          <span style={{ color: "#c792ea" }}>{"await "}</span>
          <span style={{ color: "#82aaff" }}>{"init"}</span>
          {"();\n"}
          {"    "}
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"resp "}
          <span style={{ color: "#c792ea" }}>{"= await "}</span>
          <span style={{ color: "#82aaff" }}>{"fetch"}</span>
          {"(e.data.indexUrl);\n"}
          {"    engine "}
          <span style={{ color: "#c792ea" }}>{"= new "}</span>
          <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
          {"(\n      new Uint8Array(await resp."}
          <span style={{ color: "#82aaff" }}>{"arrayBuffer"}</span>
          {"())\n    );\n"}
          {"    "}
          <span style={{ color: "#82aaff" }}>{"postMessage"}</span>
          {"({ type: "}
          <span style={{ color: "#c3e88d" }}>{`'ready'`}</span>
          {", count: engine."}
          <span style={{ color: "#82aaff" }}>{"len"}</span>
          {"() });\n  }\n"}
          {"  "}
          <span style={{ color: "#c792ea" }}>{"if "}</span>
          {"(e.data.type === "}
          <span style={{ color: "#c3e88d" }}>{`'search'`}</span>
          {") {\n"}
          {"    "}
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"results "}
          <span style={{ color: "#c792ea" }}>{"= "}</span>
          {"JSON."}
          <span style={{ color: "#82aaff" }}>{"parse"}</span>
          {"(\n      engine."}
          <span style={{ color: "#82aaff" }}>{"search"}</span>
          {"("}
          <span style={{ color: "#c792ea" }}>{"new "}</span>
          {"Float32Array(e.data.query), e.data.topK)\n    );\n"}
          {"    "}
          <span style={{ color: "#82aaff" }}>{"postMessage"}</span>
          {"({ type: "}
          <span style={{ color: "#c3e88d" }}>{`'results'`}</span>
          {", results });\n  }\n};"}
        </>
      ),
    },
    {
      label: "With Transformers.js",
      filename: "search.js",
      copyText: `import { pipeline } from '@huggingface/transformers';

// Fully client-side — zero API calls
const embed = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2'
);

const output = await embed(yourQuery, {
  pooling: 'mean',
  normalize: true
});

const results = JSON.parse(
  engine.search(new Float32Array(output.data), 5)
);
// Embeddings + retrieval — both in the browser`,
      code: (
        <>
          <span style={{ color: "#c792ea" }}>{"import "}</span>
          {"{ "}
          <span style={{ color: "#82aaff" }}>{"pipeline"}</span>
          {" } "}
          <span style={{ color: "#c792ea" }}>{"from "}</span>
          <span style={{ color: "#c3e88d" }}>{`'@huggingface/transformers';\n\n`}</span>
          <span className="text-text-muted">{"// Fully client-side — zero API calls\n"}</span>
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"embed "}
          <span style={{ color: "#c792ea" }}>{"= await "}</span>
          <span style={{ color: "#82aaff" }}>{"pipeline"}</span>
          {"(\n  "}
          <span style={{ color: "#c3e88d" }}>{`'feature-extraction'`}</span>
          {",\n  "}
          <span style={{ color: "#c3e88d" }}>{`'Xenova/all-MiniLM-L6-v2'`}</span>
          {"\n);\n\n"}
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"output "}
          <span style={{ color: "#c792ea" }}>{"= await "}</span>
          <span style={{ color: "#82aaff" }}>{"embed"}</span>
          {"(yourQuery, {\n  pooling: "}
          <span style={{ color: "#c3e88d" }}>{`'mean'`}</span>
          {",\n  normalize: "}
          <span style={{ color: "#f78c6c" }}>{"true"}</span>
          {"\n});\n\n"}
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"results "}
          <span style={{ color: "#c792ea" }}>{"= "}</span>
          {"JSON."}
          <span style={{ color: "#82aaff" }}>{"parse"}</span>
          {"(\n  engine."}
          <span style={{ color: "#82aaff" }}>{"search"}</span>
          {"("}
          <span style={{ color: "#c792ea" }}>{"new "}</span>
          {"Float32Array(output.data), "}
          <span style={{ color: "#f78c6c" }}>{"5"}</span>
          {")\n);\n"}
          <span className="text-text-muted">
            {"// Embeddings + retrieval — both in the browser"}
          </span>
        </>
      ),
    },
    {
      label: "Build Index",
      filename: "build.js",
      copyText: `// Build an index from your vectors
const engine = WasmSearchEngine.from_vectors(
  flatVectors,   // Float32Array of all vectors
  384,           // dimensions
  16,            // M (connections per node)
  200,           // ef_construction
  50             // ef_search
);

// Serialize for later use
const bytes = engine.to_bytes();
// Save as index.bin — deploy to your CDN`,
      code: (
        <>
          <span className="text-text-muted">{"// Build an index from your vectors\n"}</span>
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"engine "}
          <span style={{ color: "#c792ea" }}>{"= "}</span>
          <span style={{ color: "#6ee7b7" }}>{"WasmSearchEngine"}</span>
          {"."}
          <span style={{ color: "#82aaff" }}>{"from_vectors"}</span>
          {"(\n  flatVectors,"}
          <span className="text-text-muted">{"  // Float32Array of all vectors\n"}</span>
          {"  "}
          <span style={{ color: "#f78c6c" }}>{"384"}</span>
          {","}
          <span className="text-text-muted">{"        // dimensions\n"}</span>
          {"  "}
          <span style={{ color: "#f78c6c" }}>{"16"}</span>
          {","}
          <span className="text-text-muted">
            {"         // M (connections per node)\n"}
          </span>
          {"  "}
          <span style={{ color: "#f78c6c" }}>{"200"}</span>
          {","}
          <span className="text-text-muted">{"        // ef_construction\n"}</span>
          {"  "}
          <span style={{ color: "#f78c6c" }}>{"50"}</span>
          <span className="text-text-muted">{"          // ef_search\n"}</span>
          {");\n\n"}
          <span className="text-text-muted">{"// Serialize for later use\n"}</span>
          <span style={{ color: "#c792ea" }}>{"const "}</span>
          {"bytes "}
          <span style={{ color: "#c792ea" }}>{"= "}</span>
          {"engine."}
          <span style={{ color: "#82aaff" }}>{"to_bytes"}</span>
          {"();\n"}
          <span className="text-text-muted">
            {"// Save as index.bin — deploy to your CDN"}
          </span>
        </>
      ),
    },
  ];

  return (
    <section
      id="integrate"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <SectionLabel>Integration</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-3">
              Integrate in{" "}
              <span className="italic text-altor">minutes.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              One package. Full TypeScript types. No native dependencies.
              Works in any browser or Node.js environment.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="max-w-3xl mx-auto mt-10">
            {/* Tab bar */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {tabs.map((t, i) => (
                <button
                  type="button"
                  key={t.label}
                  onClick={() => setTab(i)}
                  className={`tab-btn ${tab === i ? "active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Code block */}
            <CodeBlock filename={tabs[tab].filename} copyText={tabs[tab].copyText} code={tabs[tab].code} />

            {/* API table */}
            <div className="mt-8 max-w-4xl mx-auto bg-surface-raised border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-border">
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  API Reference
                </span>
              </div>
              <div className="divide-y divide-surface-border">
                {[
                  {
                    method: "new WasmSearchEngine(bytes)",
                    desc: "Load a serialized index from a Uint8Array",
                  },
                  {
                    method: ".from_vectors(flat, dims, m, ef_c, ef_s)",
                    desc: "Build a new index from a flat Float32Array",
                  },
                  {
                    method: ".search(query, topK)",
                    desc: "Returns JSON [[id, distance], ...] in < 1ms",
                  },
                  {
                    method: ".add_vectors(flat, dims)",
                    desc: "Add vectors to an existing index",
                  },
                  {
                    method: ".to_bytes()",
                    desc: "Serialize the index to a Uint8Array",
                  },
                  { method: ".len()", desc: "Number of vectors in the index" },
                  { method: ".free()", desc: "Free WASM memory" },
                ].map((row) => (
                  <div
                    key={row.method}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-6 py-3"
                  >
                    <span className="font-mono text-xs text-altor font-medium min-w-0 sm:min-w-[320px]">
                      {row.method}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {row.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Honest Comparison                                                  */
/* ------------------------------------------------------------------ */
function HonestComparison() {
  const [queries, setQueries] = useState(100);

  const algoliaMonthly = queries * 0.75;
  const algoliaYearly = algoliaMonthly * 12;
  const altorCost = 0;

  return (
    <section className="py-24 md:py-32 border-t border-surface-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <div>
              <SectionLabel>The cost of static content search</SectionLabel>
              <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-5">
                If you just need semantic search,
                <br />
                <span className="italic text-altor">
                  you don't need a $600/yr platform.
                </span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Algolia is excellent for real-time faceted search over
                structured data. But for docs sites, blogs, and help centers
                with static content — altor-vec does it in the browser, for
                free, with better semantic relevance.
              </p>
              <p className="text-text-secondary leading-relaxed mb-6">
                At $0.50–$1.75 per 1,000 requests, a docs site with 100K
                monthly searches pays{" "}
                <span className="text-text-primary font-medium">
                  $600–$2,100/year
                </span>{" "}
                just for search. With altor-vec, that cost is flat at $0.
              </p>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <DollarSign size={15} className="text-altor-dim" />
                Drag the slider to see your estimated savings
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-surface-raised border border-surface-border rounded-2xl p-8">
              <div className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                Monthly search queries
              </div>
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
                    <div className="w-3 h-3 rounded-sm bg-altor" />
                    <span className="text-sm text-text-secondary">
                      altor-vec
                    </span>
                  </div>
                  <span className="font-mono text-lg font-bold text-altor">
                    {altorCost === 0 ? "Free" : `$${altorCost}/yr`}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-surface-border text-center">
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">
                  You save
                </div>
                <div className="font-display text-4xl italic text-altor">
                  ${algoliaYearly.toLocaleString()}
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
/*  Benchmarks                                                         */
/* ------------------------------------------------------------------ */
function Benchmarks() {
  const comparisons = [
    {
      label: "Search latency (10K vectors, 384d)",
      items: [
        { name: "altor-vec", display: "0.6ms", pct: 3 },
        { name: "Voy", display: "~2ms", pct: 10 },
        { name: "Orama", display: "~5ms", pct: 25 },
        { name: "Algolia", display: "50–200ms", pct: 65 },
      ],
    },
    {
      label: "Bundle size (gzipped)",
      items: [
        { name: "altor-vec", display: "54 KB", pct: 27 },
        { name: "Voy", display: "75 KB", pct: 38 },
        { name: "Orama", display: "<2 KB*", pct: 1 },
        { name: "Algolia", display: "N/A (SaaS)", pct: 0 },
      ],
    },
  ];

  return (
    <section
      id="benchmarks"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Performance</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-3">
              Measured, not{" "}
              <span className="italic text-altor">marketed.</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Real benchmarks on 10,000 documents with 384-dimension embeddings.
              All numbers independently reproducible.{" "}
              <a
                href="https://github.com/altor-lab/altor-vec/tree/main/benches"
                target="_blank"
                rel="noopener"
                className="text-altor hover:underline"
              >
                See the bench code.
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { val: "0.6ms", label: "p95 latency", sub: "WASM, Chrome" },
              { val: "54 KB", label: "gzipped", sub: ".wasm binary" },
              { val: "95.4%", label: "recall@10", sub: "10K vectors" },
              { val: "117KB", label: "raw .wasm", sub: "before gzip" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-surface-raised border border-surface-border rounded-xl p-5 text-center"
              >
                <div className="font-display text-2xl md:text-3xl italic text-altor mb-1">
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

        <div className="max-w-3xl mx-auto space-y-12">
          {comparisons.map((comp, ci) => (
            <Reveal key={comp.label} delay={ci * 100 + 120}>
              <div>
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-5 text-center">
                  {comp.label}
                </h3>
                <div className="space-y-3">
                  {comp.items.map((item, ii) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <span className="text-sm text-text-secondary w-20 text-right font-medium flex-shrink-0">
                        {item.name}
                      </span>
                      <div className="flex-1 h-7 bg-surface-raised rounded-lg overflow-hidden border border-surface-border">
                        {item.pct > 0 && (
                          <div
                            className={`h-full rounded-lg bar-animate ${
                              ii === 0 ? "bg-altor/40" : "bg-surface-overlay"
                            }`}
                            style={{
                              width: `${Math.max(item.pct, 3)}%`,
                              animationDelay: `${ci * 200 + ii * 100}ms`,
                            }}
                          />
                        )}
                      </div>
                      <span
                        className={`font-mono text-sm min-w-[90px] ${
                          ii === 0
                            ? "font-bold text-altor"
                            : "text-text-muted"
                        }`}
                      >
                        {item.display}
                      </span>
                    </div>
                  ))}
                </div>
                {ci === 1 && (
                  <p className="text-xs text-text-muted mt-3 text-center">
                    * Orama 2KB = keyword search only; vector search adds
                    significant size.
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Use Cases                                                          */
/* ------------------------------------------------------------------ */
function UseCases() {
  const segments = [
    {
      icon: BookOpen,
      title: "Documentation sites",
      desc: "Docusaurus, GitBook, Nextra, ReadTheDocs — replace keyword search with semantic understanding. Users find answers, not just matching strings.",
      tag: "Most popular",
    },
    {
      icon: FileText,
      title: "Help centers",
      desc: "Reduce support tickets by helping users find their own answers. All queries stay local — zero PII leaves the browser. No compliance risk.",
      tag: null,
    },
    {
      icon: Code2,
      title: "Technical blogs",
      desc: "100+ articles and growing? Give readers instant, relevant results across your entire archive. Works with any static site generator.",
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
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Use cases</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1]">
              Built for teams that{" "}
              <span className="italic text-altor">ship content.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {segments.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="bg-surface-raised border border-surface-border rounded-2xl p-7 hover:border-surface-border-hover transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <s.icon size={22} className="text-altor" />
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
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const items = [
    {
      q: "Is this as good as Algolia?",
      a: "For semantic (vector) search over documentation and static content — yes, often better. altor-vec uses HNSW, the same algorithm used by Pinecone, Weaviate, and pgvector. Our benchmarks show 95.4% recall@10 on 10K documents. Algolia excels at real-time indexing and faceted search over structured data — if you need those, Algolia is still the right choice.",
    },
    {
      q: "Do I need to know Rust?",
      a: "No. altor-vec is an npm package with TypeScript types. You install it with npm and call it from JavaScript. Rust is used internally to compile the WASM binary — you never touch it.",
    },
    {
      q: "What embedding model do you use?",
      a: "altor-vec is model-agnostic — it stores and searches any Float32Array vectors. Recommended models: all-MiniLM-L6-v2 (384 dims, runs in the browser via Transformers.js), text-embedding-3-small (1536 dims, OpenAI API), or embed-english-v3 (1024 dims, Cohere).",
    },
    {
      q: "How big is the index file?",
      a: "For 10K documents at 384 dimensions, the index is about 17MB. For a typical docs site with 500–2,000 pages, expect 2–5MB. The WASM binary is 54KB gzipped. Together, smaller than most hero images.",
    },
    {
      q: "How do I build an index?",
      a: "Get your document embeddings as a Float32Array, then call WasmSearchEngine.from_vectors(flat, dims, 16, 200, 50). Serialize with engine.to_bytes() and deploy the .bin file alongside your WASM. See the GitHub README for a full example.",
    },
    {
      q: "Does search work offline?",
      a: "Yes. Once the WASM binary and index are loaded, search is fully local. If your site is a PWA or installed as an app, search works with no internet connection.",
    },
    {
      q: "What about SEO?",
      a: "altor-vec is a UI search widget — it doesn't replace your content pages. Search results link to your existing pages, which are already indexed by Google. No SEO impact.",
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
            <Reveal key={item.q} delay={i * 40}>
              <div>
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                >
                  <span className="text-[15px] font-semibold text-text-primary group-hover:text-altor transition-colors pr-4">
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
  return (
    <section
      id="get-started"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-5xl mx-auto px-6">
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
                Free. Open source.{" "}
                <span className="italic text-altor">Works today.</span>
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                The full altor-vec WASM search engine — MIT licensed, no
                limitations, no account required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <CopyButton text={INSTALL_COMMAND} />
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-altor transition-colors"
                >
                  <Github size={15} />
                  View on GitHub
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-text-muted">
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1.5 hover:text-altor transition-colors"
                >
                  <Package size={12} />
                  npm package
                </a>
                <span>MIT licensed</span>
                <span>TypeScript types included</span>
                <span>Zero runtime dependencies</span>
              </div>
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
    <section
      id="contact"
      className="py-24 md:py-32 border-t border-surface-border"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <SectionLabel>Custom work</SectionLabel>
              <h2 className="font-display text-3xl md:text-[2.7rem] leading-[1.1] mb-5">
                Need something{" "}
                <span className="italic text-altor">bespoke?</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                We built altor-vec from scratch in Rust — HNSW graph
                construction, SIMD-optimized distance calculations, WASM
                compilation, Web Worker integration, the embedding pipeline.
                If you need custom vector search, performance tuning, or a
                full integration, we can help.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Custom embedding model integration",
                  "On-premise deployment for air-gapped environments",
                  "Migration from Algolia, Elasticsearch, or Typesense",
                  "Performance tuning for large-scale indexes",
                  "Managed search pipeline (coming soon)",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <Check
                      size={14}
                      className="text-altor mt-0.5 flex-shrink-0"
                    />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 bg-altor text-bg font-semibold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition"
              >
                <Mail size={15} />
                {CONTACT_EMAIL}
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-surface-raised border border-surface-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Terminal size={16} className="text-altor" />
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  We built this
                </span>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: "Rust + WASM",
                    desc: "HNSW from scratch: graph construction, greedy beam search, SIMD dot product",
                  },
                  {
                    label: "Embedding pipeline",
                    desc: "Server-side and browser-side embedding generation, index building, serialization",
                  },
                  {
                    label: "Production integration",
                    desc: "Web Workers, streaming WASM init, IndexedDB caching, offline PWA support",
                  },
                  {
                    label: "Developer tooling",
                    desc: "TypeScript types, benchmarking harness, Vite/Webpack/Next.js compatibility",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="pb-4 border-b border-surface-border last:border-0 last:pb-0"
                  >
                    <div className="text-sm font-semibold text-altor mb-1">
                      {r.label}
                    </div>
                    <div className="text-xs text-text-muted leading-relaxed">
                      {r.desc}
                    </div>
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

function BottomCTA() {
  return (
    <section className="py-20 border-t border-surface-border">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="rounded-3xl border border-altor/15 bg-altor-glow p-8 md:p-12 text-center">
            <SectionLabel>Ready to ship?</SectionLabel>
            <h2 className="font-display text-3xl md:text-[2.5rem] leading-[1.1] mb-4">
              Ready to add vector search to your app?
            </h2>
            <div className="flex justify-center mb-5">
              <CopyButton text={INSTALL_COMMAND} />
            </div>
            <p className="text-sm text-text-secondary">
              Questions?{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-altor hover:text-altor-dim transition-colors"
              >
                Email {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </Reveal>
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
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold text-altor">
              altor-vec
            </span>
            <span className="text-xs text-text-muted font-mono">
              by Altor Lab
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-text-muted">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener"
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <Github size={13} /> GitHub
            </a>
            <a
              href={NPM_URL}
              target="_blank"
              rel="noopener"
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <Package size={13} /> npm
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:text-text-secondary transition-colors flex items-center gap-1"
            >
              <Mail size={13} /> Contact
            </a>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Altor Lab. Open source under MIT
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
      <ConversionBar />
      <Nav />
      <Hero />
      <LiveSearchDemo />
      <EmailSignup />
      <SocialProofSection />
      <ComparisonCallout />
      <OpenSourceSection />
      <WhyAltorVec />
      <IntegrateInMinutes />
      <HonestComparison />
      <Benchmarks />
      <UseCases />
      <FAQ />
      <GetStarted />
      <ConsultingCTA />
      <BottomCTA />
      <Footer />
    </div>
  );
}
