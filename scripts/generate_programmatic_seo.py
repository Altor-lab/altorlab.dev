from __future__ import annotations

from dataclasses import dataclass
from html import escape
import json
from pathlib import Path
import textwrap
import xml.etree.ElementTree as ET


BASE_URL = "https://altorlab.dev"
LASTMOD = "2026-03-30"
ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
EXAMPLES_DIR = PUBLIC_DIR / "examples"
BENCHMARKS_DIR = PUBLIC_DIR / "benchmarks"
SITEMAP_PATH = PUBLIC_DIR / "sitemap.xml"

STYLE = """
body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.7;
  color: #e0e0e0;
  background: #0a0a0a;
}
a { color: #a78bfa; }
h1 { font-size: 2rem; line-height: 1.2; color: #f5f5f5; margin-bottom: 0.75rem; }
h2 { font-size: 1.35rem; color: #a78bfa; margin-top: 2.2rem; }
h3 { font-size: 1.05rem; color: #f5f5f5; margin-top: 1.5rem; }
p, li, td { color: #d4d4d8; }
strong, th { color: #f5f5f5; }
pre, .note, .callout {
  background: #111111;
  border: 1px solid #27272a;
  border-radius: 10px;
  padding: 16px;
}
pre { overflow-x: auto; }
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 0.92rem;
  color: #ede9fe;
}
table { width: 100%; border-collapse: collapse; margin: 1rem 0 1.5rem; }
th, td { border: 1px solid #27272a; padding: 10px; text-align: left; vertical-align: top; }
th { background: #141418; }
ul { padding-left: 20px; }
nav { margin-bottom: 1.5rem; }
.kicker {
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
}
.small { color: #94a3b8; font-size: 0.95rem; }
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 1.25rem;
}
.card {
  display: block;
  text-decoration: none;
  background: #111111;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 16px;
}
.card:hover { border-color: #a78bfa; }
""".strip()

EMBED_FUNCTION = """
function embedText(text) {
  const vector = new Float32Array(dims);
  for (const token of text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
    let hash = 2166136261;
    for (const char of token) {
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    }
    const slot = Math.abs(hash) % dims;
    vector[slot] += 1;
    vector[(slot + token.length) % dims] += token.length / 10;
  }
  const magnitude = Math.hypot(...vector) || 1;
  return Array.from(vector, (value) => value / magnitude);
}
""".strip()


@dataclass(frozen=True)
class ExamplePage:
    slug: str
    name: str
    summary: str
    challenge: str
    why_local: str
    production_note: str
    sample_query: str
    placeholder: str
    use_cases: list[str]
    limitations: str
    records: list[dict[str, str]]
    faqs: list[tuple[str, str]]


@dataclass(frozen=True)
class BenchmarkPage:
    slug: str
    competitor: str
    summary: str
    intro: str
    runtime: tuple[str, str]
    bundle: tuple[str, str]
    latency: tuple[str, str]
    memory: tuple[str, str]
    features: tuple[str, str]
    dataset: tuple[str, str]
    altor_wins: list[str]
    competitor_wins: list[str]
    honest_takeaway: str
    faqs: list[tuple[str, str]]


EXAMPLE_PAGES = [
    ExamplePage(
        slug="autocomplete",
        name="Autocomplete",
        summary="Semantic typeahead for support intents, command palettes, and documentation search boxes.",
        challenge="Autocomplete breaks down when users remember the goal but not the exact label. Semantic retrieval lets the interface recover from fuzzy prefixes such as 'forgot login' or 'team invite setup' without waiting on a backend request.",
        why_local="Keeping the HNSW index inside the browser removes network jitter from every keystroke, which is exactly where perceived quality lives. Local search also means you can keep half-written queries on device instead of sending them to an API.",
        production_note="Use a real embedding model such as MiniLM or multilingual-e5 for production ranking quality, but keep the altor-vec index build and query flow exactly the same.",
        sample_query="forgot my password",
        placeholder="Type a support question",
        use_cases=[
            "Support intent suggestions",
            "Command palettes",
            "Documentation typeahead",
            "Settings search",
        ],
        limitations="The deterministic embedding helper keeps the snippet dependency-free, but it is not a substitute for a learned embedding model. Very large suggestion catalogs still cost memory, and if labels change constantly you need a strategy for rebuilding or shipping fresh vectors.",
        records=[
            {
                "title": "Reset password",
                "text": "Help a user recover account access after forgetting a password.",
                "meta": "account",
            },
            {
                "title": "Invite teammate",
                "text": "Add a coworker to the workspace with the right permissions.",
                "meta": "team",
            },
            {
                "title": "Update billing card",
                "text": "Change the payment method for a subscription or invoice.",
                "meta": "billing",
            },
            {
                "title": "Enable SSO",
                "text": "Configure enterprise single sign-on with SAML.",
                "meta": "security",
            },
            {
                "title": "Export analytics report",
                "text": "Download weekly metrics as CSV or PDF.",
                "meta": "reporting",
            },
            {
                "title": "Change notification email",
                "text": "Update where invoices and alerts are delivered.",
                "meta": "account",
            },
        ],
        faqs=[
            (
                "Can I use altor-vec for keystroke-by-keystroke autocomplete?",
                "Yes. That is one of the strongest fits because query latency is local and predictable once the vectors are already on device.",
            ),
            (
                "Do I need a backend to make this semantic?",
                "No. The search index can live entirely in the browser. You only need a backend if your corpus is private, too large to ship, or updated continuously.",
            ),
            (
                "What should I swap in for the demo embedText helper?",
                "Use a real embedding model or precomputed vectors. The example keeps the same indexing API so you can upgrade quality without changing the surrounding search code.",
            ),
        ],
    ),
    ExamplePage(
        slug="recommendation-engine",
        name="Recommendation Engine",
        summary="Related-item retrieval for storefronts, feeds, and in-app suggestion modules.",
        challenge="Recommendation surfaces often need a 'more like this' answer before you have enough behavioral data for collaborative filtering. Vector similarity gives you a content-based recommendation layer that can ship with the product itself.",
        why_local="Running the retrieval step in the client keeps related-item modules fast and cheap, especially for offline-first catalogs or content collections that barely change during a session.",
        production_note="Many teams start with text or metadata embeddings, then blend in clicks and sales signals later. altor-vec still handles the nearest-neighbor step after you compute those vectors.",
        sample_query="lightweight travel backpack",
        placeholder="Describe the item you want to match",
        use_cases=[
            "Related products",
            "More like this buttons",
            "Editorial recommendation blocks",
            "Session-based content suggestions",
        ],
        limitations="Content-based recommendations can over-index on similarity and ignore business rules, margin, availability, or diversity. You may also need post-filters to prevent showing out-of-stock items or recommendations from the wrong collection.",
        records=[
            {
                "title": "Urban commuter backpack",
                "text": "Slim weatherproof bag for laptops, cables, and daily train commutes.",
                "meta": "bags",
            },
            {
                "title": "Carry-on travel duffel",
                "text": "Soft-sided weekender with shoe pocket and overhead-bin size.",
                "meta": "bags",
            },
            {
                "title": "Minimal hiking daypack",
                "text": "Compact trail bag with hydration sleeve and lightweight straps.",
                "meta": "outdoor",
            },
            {
                "title": "Packing cube organizer set",
                "text": "Compression cubes for separating shoes, clothes, and toiletries.",
                "meta": "travel",
            },
            {
                "title": "RFID passport wallet",
                "text": "Travel wallet for cards, passport, and boarding passes.",
                "meta": "travel",
            },
            {
                "title": "Camera sling bag",
                "text": "Protective shoulder bag for mirrorless kits and accessories.",
                "meta": "photo",
            },
        ],
        faqs=[
            (
                "Is altor-vec a full recommendation platform?",
                "No. It is the retrieval layer. Ranking logic, merchandising rules, and experiments still belong in your application.",
            ),
            (
                "Can this work without user history?",
                "Yes. This pattern is specifically useful before you have meaningful collaborative signals because the vectors come from item content instead.",
            ),
            (
                "When should I avoid client-side recommendations?",
                "Avoid shipping the full index when the catalog is sensitive, huge, or updated so often that a local asset quickly becomes stale.",
            ),
        ],
    ),
    ExamplePage(
        slug="product-search",
        name="Product Search",
        summary="Natural-language retrieval for e-commerce catalogs without a dedicated search backend.",
        challenge="Shoppers rarely type exact SKU language. They describe goals such as 'gift for remote coworker' or 'soft black running shorts with pockets' and expect relevant products even if those words never appear together in the title.",
        why_local="A browser index works well for curated, seasonal, or edge-cached catalogs where fast intent matching matters more than infinite scale. The experience stays responsive even on flaky mobile connections.",
        production_note="Combine embeddings with metadata filters such as price band, availability, or category when you move from proof of concept to production search results.",
        sample_query="wireless keyboard for travel",
        placeholder="Search products semantically",
        use_cases=[
            "Small to medium storefronts",
            "Shoppable landing pages",
            "Embedded search widgets",
            "Trade-show or kiosk catalogs",
        ],
        limitations="Client-side search is best when the corpus is safe to ship and moderate in size. Large catalogs, strict ACLs, and real-time inventory writes usually push you toward a server-side index or hybrid architecture.",
        records=[
            {
                "title": "Foldable Bluetooth keyboard",
                "text": "Pocket-sized wireless keyboard for tablets, travel desks, and remote work kits.",
                "meta": "accessories",
            },
            {
                "title": "Mechanical desk keyboard",
                "text": "Full-size tactile keyboard with hot-swap switches and RGB lighting.",
                "meta": "peripherals",
            },
            {
                "title": "USB-C laptop stand",
                "text": "Portable stand that lifts a notebook for better posture on the road.",
                "meta": "ergonomics",
            },
            {
                "title": "Travel mouse",
                "text": "Compact quiet wireless mouse with USB-C charging and slim carry case.",
                "meta": "accessories",
            },
            {
                "title": "Noise-canceling headset",
                "text": "Wireless over-ear headset for calls, focus time, and noisy cafes.",
                "meta": "audio",
            },
            {
                "title": "Screen cleaning kit",
                "text": "Microfiber and spray kit for monitors, tablets, and phones.",
                "meta": "care",
            },
        ],
        faqs=[
            (
                "Can altor-vec replace Algolia or Elasticsearch for every store?",
                "No. It is strongest for smaller, shippable catalogs and local UX. Large stores usually need server-side indexing, faceting, and operational tooling.",
            ),
            (
                "Can I combine semantic search with filters?",
                "Yes. A common pattern is semantic retrieval first, followed by metadata filters such as brand, stock status, or price range.",
            ),
            (
                "Why use vector search for products instead of keyword search only?",
                "Vectors help match intent, synonyms, and descriptive phrasing that exact-term matching often misses.",
            ),
        ],
    ),
    ExamplePage(
        slug="document-search",
        name="Document Search",
        summary="Browser-native retrieval for knowledge bases, policy libraries, and internal manuals.",
        challenge="Document portals become hard to navigate when users remember a concept but not a file name. A vector index lets them ask for 'security review checklist' and retrieve the closest policy chunks instead of relying on exact phrasing.",
        why_local="For static manuals, docs bundles, and packaged internal portals, local search means instant retrieval with no dependency on a live API. That is especially valuable for field teams or air-gapped review environments.",
        production_note="For long documents, chunk them before indexing so the result points to a specific section instead of a whole PDF or page title.",
        sample_query="vendor security review checklist",
        placeholder="Search your documents",
        use_cases=[
            "Handbooks",
            "Policy centers",
            "Offline manuals",
            "Embedded doc search in SaaS apps",
        ],
        limitations="If documents are access-controlled per user or change minute by minute, shipping the corpus to the browser is usually the wrong architecture. Search quality also depends heavily on chunking strategy and embeddings.",
        records=[
            {
                "title": "Incident response playbook",
                "text": "Checklist for triage, communication, and postmortems during security incidents.",
                "meta": "security",
            },
            {
                "title": "Vendor review policy",
                "text": "Security questionnaire and approval steps for third-party vendors.",
                "meta": "procurement",
            },
            {
                "title": "Onboarding guide",
                "text": "First-week checklist for new hires, tooling access, and team introductions.",
                "meta": "people",
            },
            {
                "title": "Travel reimbursement rules",
                "text": "Allowed expenses, receipt thresholds, and reimbursement timelines.",
                "meta": "finance",
            },
            {
                "title": "Design system handbook",
                "text": "Usage rules for colors, tokens, spacing, and component accessibility.",
                "meta": "design",
            },
            {
                "title": "Data retention policy",
                "text": "Rules for storing, deleting, and archiving customer information.",
                "meta": "legal",
            },
        ],
        faqs=[
            (
                "Is this good for offline manuals?",
                "Yes. Static manuals are one of the clearest wins because the index can be bundled once and searched locally.",
            ),
            (
                "Should I index whole documents or chunks?",
                "Chunks are usually better. Smaller units produce more precise retrieval and make it easier to jump to the exact section a user needs.",
            ),
            (
                "What is the main architectural limit?",
                "The browser can only search what you ship to it, so sensitive or highly dynamic document stores usually belong on the server.",
            ),
        ],
    ),
    ExamplePage(
        slug="image-search",
        name="Image Search",
        summary="Caption- and tag-based image retrieval for curated media libraries.",
        challenge="Image libraries are often searched by intent, mood, or scene description rather than exact filenames. Vector search lets a user type 'sunset city skyline' or 'happy team workshop' and retrieve the nearest captioned assets.",
        why_local="For design systems, marketing asset bundles, or offline media explorers, local retrieval removes API round trips and keeps browsing fluid while the user scans many variations.",
        production_note="The example indexes text captions because that keeps the snippet lightweight. In production you can use CLIP-style embeddings or any pipeline that projects both text and images into the same vector space.",
        sample_query="cozy coffee shop interior",
        placeholder="Describe the image you need",
        use_cases=[
            "Stock photo pickers",
            "Marketing asset browsers",
            "Creative inspiration boards",
            "Offline media catalogs",
        ],
        limitations="This pattern assumes you have useful captions or multimodal embeddings. Pure filename indexing is not enough, and very large image collections still challenge browser memory and download budgets.",
        records=[
            {
                "title": "Morning cafe counter",
                "text": "Warm wooden coffee bar with pastries, espresso machine, and soft window light.",
                "meta": "interior",
            },
            {
                "title": "Remote team workshop",
                "text": "Colleagues around a table covered in sticky notes and laptops.",
                "meta": "team",
            },
            {
                "title": "Downtown skyline at dusk",
                "text": "City skyline with purple sunset, office towers, and river reflections.",
                "meta": "city",
            },
            {
                "title": "Trail runner in forest",
                "text": "Athlete sprinting through a pine trail with dramatic side light.",
                "meta": "outdoor",
            },
            {
                "title": "Minimal product flat lay",
                "text": "Neutral tabletop composition with skincare bottles and shadows.",
                "meta": "product",
            },
            {
                "title": "Warehouse fulfillment line",
                "text": "Workers packing boxes beside shelves and barcode scanners.",
                "meta": "operations",
            },
        ],
        faqs=[
            (
                "Do I need multimodal embeddings for image search?",
                "For strong production quality, yes. The lightweight example uses captions only, which is runnable but less powerful than a shared text-image embedding space.",
            ),
            (
                "Can I search a private asset bundle entirely offline?",
                "Yes. If the assets and their embeddings are safe to ship, altor-vec can keep retrieval fully local.",
            ),
            (
                "Where does the browser approach stop working well?",
                "At very large media-library sizes or when the source assets cannot be exposed to the client.",
            ),
        ],
    ),
    ExamplePage(
        slug="faq-search",
        name="FAQ Search",
        summary="Intent-based answer lookup for help centers and support widgets.",
        challenge="FAQ content usually has short questions but many ways to ask the same thing. Semantic search helps one answer cover variants such as 'cancel plan', 'end subscription', or 'stop renewal' without manually tuning every synonym.",
        why_local="A browser-side FAQ index is especially useful in support widgets because it makes suggestions appear instantly before a user submits a ticket. That lowers support load without adding another backend dependency.",
        production_note="The same retrieval pattern can power both the quick-answer layer and the context picker for a later chat or ticket workflow.",
        sample_query="how do I stop my subscription",
        placeholder="Ask a support question",
        use_cases=[
            "Support widgets",
            "Help centers",
            "In-app onboarding guidance",
            "Customer success portals",
        ],
        limitations="FAQ search still depends on content quality. If answers are outdated or too broad, semantic retrieval will faithfully find weak material. You may also need analytics to understand which unanswered intents deserve new content.",
        records=[
            {
                "title": "How do I cancel my plan?",
                "text": "Open Billing, choose the current plan, and select cancel renewal.",
                "meta": "billing",
            },
            {
                "title": "Can I invite another admin?",
                "text": "Workspace owners can promote teammates from the members screen.",
                "meta": "team",
            },
            {
                "title": "Where do I download invoices?",
                "text": "Invoices are available under Billing history for every paid cycle.",
                "meta": "billing",
            },
            {
                "title": "How do I reset MFA?",
                "text": "An owner can reset multi-factor authentication for a locked-out user.",
                "meta": "security",
            },
            {
                "title": "Does the app work offline?",
                "text": "Core browsing features work offline after the first sync completes.",
                "meta": "product",
            },
            {
                "title": "How do I export data?",
                "text": "Use the exports page to create CSV or JSON downloads.",
                "meta": "data",
            },
        ],
        faqs=[
            (
                "Is vector search useful even for small FAQ sets?",
                "Yes, because the value is not only scale. It is also about matching messy user phrasing to the right answer instantly.",
            ),
            (
                "Can I keep the widget offline-capable?",
                "Yes. A local FAQ index works well in PWAs or embedded help panels that should continue responding without a network trip.",
            ),
            (
                "Should I replace keywords completely?",
                "Not necessarily. Many teams combine vector retrieval with exact filters for account IDs, product names, or feature flags.",
            ),
        ],
    ),
    ExamplePage(
        slug="code-search",
        name="Code Search",
        summary="Semantic lookup for snippets, internal helpers, and example repositories.",
        challenge="Developers often remember what a function does rather than what it is called. Vector search helps queries like 'parse webhook signature' or 'build retrying fetch wrapper' land on the right snippet without exact identifier matches.",
        why_local="A local code index works well for docs, SDK playgrounds, and offline reference bundles where quick snippet recall matters more than repository-scale indexing or full structural analysis.",
        production_note="This pattern complements rather than replaces AST-aware tooling. Use vectors for intent retrieval, then link out to a richer editor or repository browser when needed.",
        sample_query="debounced search input hook",
        placeholder="Describe the code you need",
        use_cases=[
            "SDK docs",
            "Snippet libraries",
            "Engineering handbooks",
            "Offline reference apps",
        ],
        limitations="Vector search is not a full code intelligence engine. It will not understand refactors, symbol definitions, or type relationships as deeply as language-server or AST tooling.",
        records=[
            {
                "title": "Retrying fetch helper",
                "text": "Wrapper around fetch with backoff, timeout support, and retryable status codes.",
                "meta": "network",
            },
            {
                "title": "Debounced input hook",
                "text": "React hook that delays expensive work until typing pauses.",
                "meta": "react",
            },
            {
                "title": "Webhook signature verifier",
                "text": "Node utility for HMAC verification of incoming webhook requests.",
                "meta": "security",
            },
            {
                "title": "CSV export function",
                "text": "Serialize table rows into downloadable CSV in the browser.",
                "meta": "data",
            },
            {
                "title": "Feature flag gate",
                "text": "Small helper for checking staged rollout settings.",
                "meta": "infra",
            },
            {
                "title": "Accessible modal component",
                "text": "Dialog with focus trap, escape handling, and aria attributes.",
                "meta": "ui",
            },
        ],
        faqs=[
            (
                "Can altor-vec replace grep or sourcegraph?",
                "No. It fills a different role by matching concepts and descriptions, not exact code structure or repository-scale indexing.",
            ),
            (
                "What is a good dataset for browser code search?",
                "Docs snippets, cookbook examples, or a curated helper library are great fits because the corpus is compact and safe to ship.",
            ),
            (
                "Can I mix semantic and exact matching?",
                "Yes. That hybrid usually works best for code because identifiers, filenames, and API names still matter.",
            ),
        ],
    ),
    ExamplePage(
        slug="offline-search",
        name="Offline Search",
        summary="Cache-first semantic retrieval for PWAs, field apps, and packaged reference tools.",
        challenge="Offline products still need more than keyword search. Field teams, sales reps, and warehouse operators often remember a description of the answer they need, not the exact phrase printed in a manual.",
        why_local="altor-vec is naturally aligned with offline search because the index is designed to live in the browser or packaged app. Once cached, queries stay fast even without connectivity.",
        production_note="Most teams pair this with a service worker or static asset cache so the vectors download once and survive intermittent connectivity.",
        sample_query="safety checklist before opening machine panel",
        placeholder="Search while offline",
        use_cases=["PWAs", "Field manuals", "Kiosk apps", "Sales enablement bundles"],
        limitations="Offline search only covers the content already synced to the device. If the source material changes often, you need a reliable refresh story and clear UI to indicate staleness.",
        records=[
            {
                "title": "Panel safety checklist",
                "text": "Lockout, gloves, and voltage checks before opening electrical panels.",
                "meta": "safety",
            },
            {
                "title": "Battery replacement guide",
                "text": "Procedure for swapping the handheld scanner battery in the field.",
                "meta": "hardware",
            },
            {
                "title": "Cold-start troubleshooting",
                "text": "Steps when a machine fails to boot after overnight storage.",
                "meta": "maintenance",
            },
            {
                "title": "Calibration workflow",
                "text": "How to recalibrate sensors after a parts replacement.",
                "meta": "maintenance",
            },
            {
                "title": "Warranty claim intake",
                "text": "Required photos, serial numbers, and customer notes.",
                "meta": "support",
            },
            {
                "title": "Spare parts lookup",
                "text": "How to identify replacement parts from assembly diagrams.",
                "meta": "inventory",
            },
        ],
        faqs=[
            (
                "Does altor-vec need a network connection after load?",
                "No. Once the WebAssembly and vector data are on device, search can run entirely offline.",
            ),
            (
                "What else do I need for a real offline product?",
                "Usually a cache strategy, asset versioning, and a refresh policy so users know when local content is current.",
            ),
            (
                "When is offline vector search a bad fit?",
                "When the corpus is too large to ship or must reflect sensitive server-only data in real time.",
            ),
        ],
    ),
    ExamplePage(
        slug="privacy-preserving-search",
        name="Privacy-Preserving Search",
        summary="Local semantic retrieval for sensitive notes, contracts, and on-device assistants.",
        challenge="Some search experiences lose value the moment queries leave the device. Employees searching compensation guidelines, users exploring personal notes, or legal teams reviewing contract clauses often need the retrieval layer to stay local.",
        why_local="Because altor-vec can run entirely in-browser, the query text and the search index do not need to transit a third-party search API. That changes the privacy story substantially for certain products.",
        production_note="Privacy-preserving search still requires careful thought about how embeddings are generated, stored, and refreshed. Local retrieval is only one part of the privacy model.",
        sample_query="termination clause with 30 day notice",
        placeholder="Search locally on this device",
        use_cases=[
            "Personal knowledge bases",
            "Client-side legal review",
            "Private journals",
            "On-device enterprise assistants",
        ],
        limitations="If you compute embeddings in a remote service, the pipeline is no longer fully local. You also need to protect the downloaded corpus itself; client-side search is not appropriate if the underlying material should never be present on the device.",
        records=[
            {
                "title": "Termination clause",
                "text": "Contract language covering notice periods and convenience termination rights.",
                "meta": "contracts",
            },
            {
                "title": "Data processing addendum",
                "text": "Terms about subprocessors, retention, and deletion obligations.",
                "meta": "privacy",
            },
            {
                "title": "Expense reimbursement note",
                "text": "Internal policy on meal limits, airfare class, and receipt rules.",
                "meta": "policy",
            },
            {
                "title": "Manager feedback journal",
                "text": "Private note summarizing performance conversations and follow-ups.",
                "meta": "notes",
            },
            {
                "title": "Offer approval checklist",
                "text": "Compensation review flow for recruiting and finance sign-off.",
                "meta": "people",
            },
            {
                "title": "M&A diligence memo",
                "text": "Summary of outstanding legal and data room questions.",
                "meta": "legal",
            },
        ],
        faqs=[
            (
                "Does browser search automatically make a product private?",
                "No. It reduces query exposure, but you still need to consider where vectors come from, how files are cached, and whether the corpus itself is safe to download.",
            ),
            (
                "Can I keep both queries and content on device?",
                "Yes, if you ship the vectors locally and avoid remote embedding generation at query time.",
            ),
            (
                "When should I choose a server instead?",
                "Choose a server when the dataset should not be distributed to clients or when permissions differ per user.",
            ),
        ],
    ),
    ExamplePage(
        slug="multilingual-search",
        name="Multilingual Search",
        summary="Cross-language retrieval when users search in one language and the corpus lives in another.",
        challenge="Global products need search that survives translation gaps. A Spanish query such as 'restablecer contraseña' should still find English support material if the underlying embedding space aligns those meanings.",
        why_local="Local retrieval helps international apps keep the same fast UX everywhere, even where mobile connectivity is inconsistent or where the corpus is distributed as a static bundle.",
        production_note="The key is the embedding model, not the ANN library. altor-vec handles the nearest-neighbor lookup after you choose a multilingual embedding model or precompute aligned vectors.",
        sample_query="restablecer contraseña del equipo",
        placeholder="Search in any supported language",
        use_cases=[
            "Global help centers",
            "Travel apps",
            "Consumer apps with multilingual UI",
            "International internal tools",
        ],
        limitations="The demo helper is not actually multilingual, so it only illustrates the retrieval wiring. Real multilingual quality depends on aligned embeddings and often benefits from evaluation across your supported languages.",
        records=[
            {
                "title": "Reset workspace password",
                "text": "Instructions for changing or resetting a forgotten account password.",
                "meta": "account",
            },
            {
                "title": "Invite a teammate",
                "text": "How to add another person and assign the right access role.",
                "meta": "team",
            },
            {
                "title": "Download invoices",
                "text": "Where to find paid invoices and billing history exports.",
                "meta": "billing",
            },
            {
                "title": "Actualizar método de pago",
                "text": "Pasos para cambiar la tarjeta asociada a una suscripción activa.",
                "meta": "billing",
            },
            {
                "title": "Configurer l'authentification SSO",
                "text": "Guide d'activation du SAML pour les connexions d'entreprise.",
                "meta": "security",
            },
            {
                "title": "Esportare i dati",
                "text": "Come creare esportazioni CSV o JSON dal pannello dati.",
                "meta": "data",
            },
        ],
        faqs=[
            (
                "Is altor-vec itself multilingual?",
                "The library is embedding-model agnostic. Multilingual behavior comes from the vectors you feed into it, not from the ANN engine alone.",
            ),
            (
                "Can one local index support many languages?",
                "Yes, if the embeddings place semantically similar text from different languages near each other.",
            ),
            (
                "What should I benchmark first?",
                "Recall quality across languages. Latency is usually easy; the harder part is validating that your embedding model really aligns the languages you care about.",
            ),
        ],
    ),
    ExamplePage(
        slug="rag-retrieval",
        name="RAG Retrieval",
        summary="Local chunk selection before prompt assembly for browser-side retrieval augmented generation.",
        challenge="RAG is only as good as the chunks it retrieves. When the corpus is small enough to ship, client-side retrieval can cut cost and latency by selecting context locally before any model call happens.",
        why_local="This is attractive for documentation copilots, product tours, and local-first assistants because the retrieval layer becomes instant and predictable. You only spend remote tokens on generation, not search.",
        production_note="The same pattern works whether the final model runs remotely, in WebGPU, or in another on-device runtime. altor-vec simply provides the chunk shortlist.",
        sample_query="how do I rotate an API key",
        placeholder="Ask a knowledge question",
        use_cases=[
            "Docs copilots",
            "Embedded support chat",
            "Product assistants",
            "On-device RAG prototypes",
        ],
        limitations="RAG quality still depends on chunking, prompt assembly, and source freshness. For large private corpora or rapidly changing knowledge bases, server-side retrieval is often the safer choice.",
        records=[
            {
                "title": "API key rotation",
                "text": "Create a new key, update your environment, then revoke the old key after validation.",
                "meta": "security",
            },
            {
                "title": "Webhook retries",
                "text": "Events retry with exponential backoff for up to twenty-four hours.",
                "meta": "integrations",
            },
            {
                "title": "Rate limit policy",
                "text": "Per-token and per-project limits plus guidance for queueing requests.",
                "meta": "platform",
            },
            {
                "title": "Role management",
                "text": "Owners, admins, and viewers have different workspace permissions.",
                "meta": "auth",
            },
            {
                "title": "Data export guide",
                "text": "Export logs, traces, and usage reports from the admin console.",
                "meta": "data",
            },
            {
                "title": "Audit events",
                "text": "Security-sensitive actions are recorded in the audit event stream.",
                "meta": "security",
            },
        ],
        faqs=[
            (
                "Can altor-vec be the retrieval layer for browser RAG?",
                "Yes. That is a natural fit when the corpus is small enough to ship and you want fast local chunk recall.",
            ),
            (
                "Does this replace the language model?",
                "No. It only retrieves relevant context. You still need a generation model or answer synthesizer downstream.",
            ),
            (
                "When should retrieval move back to the server?",
                "When the corpus is large, access-controlled, frequently updated, or too sensitive to send to the browser.",
            ),
        ],
    ),
    ExamplePage(
        slug="chat-memory",
        name="Chat Memory",
        summary="Semantic recall of past turns, notes, and facts for assistants that run in the browser.",
        challenge="Chat history gets long quickly, but only a few facts matter to the next answer. Vector search lets an assistant recall semantically related memories instead of replaying the entire transcript every turn.",
        why_local="Local memory retrieval is compelling for privacy-sensitive assistants and low-latency chat UIs because recall does not require a network round trip. It can also reduce token usage by selecting only the most relevant snippets.",
        production_note="In production you may combine recency, conversation IDs, and memory types with semantic similarity so the assistant retrieves both relevant and current context.",
        sample_query="what city did the customer say they were opening in",
        placeholder="Search prior conversation memory",
        use_cases=[
            "Customer support copilots",
            "Personal note assistants",
            "Browser chat apps",
            "Sales prep tools",
        ],
        limitations="Memory retrieval needs guardrails. Old facts can become stale, and purely semantic recall may surface the wrong turn unless you layer in recency or thread filters.",
        records=[
            {
                "title": "Customer expansion plan",
                "text": "The customer plans to open a new office in Austin next quarter.",
                "meta": "account",
            },
            {
                "title": "Preferred renewal month",
                "text": "Procurement wants contract review to start in September.",
                "meta": "renewal",
            },
            {
                "title": "Feature request",
                "text": "Asked for weekly exports to S3 instead of manual CSV downloads.",
                "meta": "product",
            },
            {
                "title": "Stakeholder note",
                "text": "Security approval depends on SSO and audit log documentation.",
                "meta": "security",
            },
            {
                "title": "Support blocker",
                "text": "User cannot complete MFA because they changed phones.",
                "meta": "support",
            },
            {
                "title": "Budget guidance",
                "text": "Team expects to stay under a twenty seat plan this quarter.",
                "meta": "commercial",
            },
        ],
        faqs=[
            (
                "Can altor-vec store long-term memory for a chat app?",
                "It can support the retrieval step, but you still need your own policy for what gets saved, updated, or forgotten.",
            ),
            (
                "Why use vector recall instead of raw transcript search?",
                "Because users usually ask for a concept or fact, not an exact phrase from a past turn.",
            ),
            (
                "What extra ranking signals help most?",
                "Recency, conversation boundaries, and memory type metadata usually make memory retrieval much more reliable.",
            ),
        ],
    ),
    ExamplePage(
        slug="content-deduplication",
        name="Content Deduplication",
        summary="Near-duplicate detection for editorial pipelines, datasets, and CMS migrations.",
        challenge="Duplicate content rarely matches word for word. Marketing teams rewrite headlines, support teams copy old answers, and migrations create slightly different versions of the same article. Vector similarity is a good first pass for spotting semantic overlap.",
        why_local="For a moderate review batch, local comparison is useful because editors can run it privately in the browser without provisioning a database just to score overlap.",
        production_note="Most teams use vector similarity for candidate generation, then run a stricter review step before auto-merging or deleting anything important.",
        sample_query="remote work stipend policy",
        placeholder="Find semantically similar content",
        use_cases=[
            "CMS cleanup",
            "Editorial QA",
            "Dataset curation",
            "Knowledge-base migrations",
        ],
        limitations="A nearest-neighbor match is not proof that two documents are safe to collapse. Legal wording, version history, and ownership still matter, so keep a human review step for consequential content decisions.",
        records=[
            {
                "title": "Remote work reimbursement",
                "text": "Policy describing stipends for desks, chairs, and home office accessories.",
                "meta": "people",
            },
            {
                "title": "Home office allowance",
                "text": "Guidelines for claiming remote setup expenses during the first ninety days.",
                "meta": "people",
            },
            {
                "title": "Travel expense rules",
                "text": "Approved hotel, flight, and meal costs for business travel.",
                "meta": "finance",
            },
            {
                "title": "Laptop refresh process",
                "text": "How employees request a replacement laptop after the standard lifecycle.",
                "meta": "it",
            },
            {
                "title": "Equipment return checklist",
                "text": "Steps for collecting laptops and badges during offboarding.",
                "meta": "it",
            },
            {
                "title": "Manager onboarding notes",
                "text": "Guide for new managers running first-week team introductions.",
                "meta": "people",
            },
        ],
        faqs=[
            (
                "Is vector search enough to deduplicate content automatically?",
                "Usually not. It is excellent for surfacing likely duplicates, but you still need review logic before deleting or merging records.",
            ),
            (
                "What similarity threshold should I use?",
                "There is no universal threshold. Benchmark it on your own corpus because writing style and chunk length change the right cutoff.",
            ),
            (
                "Can this help before a CMS migration?",
                "Yes. Candidate duplicate lists are a common way to shrink and clean a corpus before you move it.",
            ),
        ],
    ),
    ExamplePage(
        slug="similar-items",
        name="Similar Items",
        summary="More-like-this retrieval for catalogs, playlists, and content grids.",
        challenge="Users often discover what they want by starting from one good item and asking for nearby options. A vector index gives you a fast semantic neighborhood lookup that feels natural in browsing-heavy products.",
        why_local="Because the query can be the item's own vector, similar-item retrieval is cheap once the local index exists. That makes it a strong fit for static catalogs and collections with high browse-to-search behavior.",
        production_note="This pattern is close to recommendation retrieval, but the UI trigger is different: the starting point is an existing item rather than an open-ended user query.",
        sample_query="linen short sleeve button up",
        placeholder="Describe an item or reuse an existing vector",
        use_cases=[
            "More like this modules",
            "Playlist expansion",
            "Article related reads",
            "Marketplace browsing",
        ],
        limitations="Similarity alone can create repetitive results. Many products add diversity rules, stock checks, or popularity signals to keep the recommendations useful and commercially sensible.",
        records=[
            {
                "title": "Linen camp shirt",
                "text": "Breathable short-sleeve shirt for warm weather with relaxed fit.",
                "meta": "apparel",
            },
            {
                "title": "Cotton oxford shirt",
                "text": "Structured button-down shirt for office and casual wear.",
                "meta": "apparel",
            },
            {
                "title": "Seersucker resort shirt",
                "text": "Light textured shirt with airy fabric and vacation styling.",
                "meta": "apparel",
            },
            {
                "title": "Merino travel tee",
                "text": "Odor-resistant lightweight t-shirt for packing light.",
                "meta": "apparel",
            },
            {
                "title": "Drawstring summer shorts",
                "text": "Soft shorts with stretch waist and side pockets.",
                "meta": "apparel",
            },
            {
                "title": "Canvas overshirt",
                "text": "Heavier layer for cool evenings and transitional weather.",
                "meta": "apparel",
            },
        ],
        faqs=[
            (
                "How is this different from recommendation-engine pages?",
                "The retrieval mechanics are similar, but similar-items usually starts from one known item instead of a free-form shopper query.",
            ),
            (
                "Can I precompute 'related items' offline?",
                "Yes. Many teams build the index ahead of time and query it instantly in the browser at render time.",
            ),
            (
                "What usually improves result quality the most?",
                "Better embeddings plus post-filters for category, price, availability, and diversity.",
            ),
        ],
    ),
    ExamplePage(
        slug="semantic-filtering",
        name="Semantic Filtering",
        summary="Intent-based narrowing of results before or alongside structured filters.",
        challenge="Structured filters only work when the user understands your taxonomy. Semantic filtering helps them express fuzzy intent such as 'quiet ergonomic setup' or 'starter-friendly trail gear' before exact facets take over.",
        why_local="A local vector layer can score every item against a concept instantly, then your application can intersect that shortlist with normal filters like brand, stock, or price.",
        production_note="Think of semantic filtering as a complement to metadata filters rather than a replacement. The strongest experiences let both collaborate.",
        sample_query="beginner friendly camping gear",
        placeholder="Describe the vibe or intent",
        use_cases=[
            "Storefront refinement",
            "Marketplace discovery",
            "Curated collections",
            "Media library exploration",
        ],
        limitations="Semantic scores are approximate and subjective. If users need exact eligibility rules, safety constraints, or guaranteed compliance filters, metadata must still remain authoritative.",
        records=[
            {
                "title": "Starter campsite bundle",
                "text": "Beginner-friendly tent, sleeping bag, and lantern kit for weekend trips.",
                "meta": "camping",
            },
            {
                "title": "Ultralight thru-hike set",
                "text": "Minimal gear for experienced hikers prioritizing low pack weight.",
                "meta": "camping",
            },
            {
                "title": "Family car-camping tent",
                "text": "Large easy-pitch shelter with room dividers and storage pockets.",
                "meta": "camping",
            },
            {
                "title": "Portable camp stove",
                "text": "Compact gas stove for quick meals on short outdoor trips.",
                "meta": "cooking",
            },
            {
                "title": "Insulated sleeping pad",
                "text": "Warm inflatable pad for shoulder-season camping nights.",
                "meta": "sleep",
            },
            {
                "title": "Trail first-aid pouch",
                "text": "Compact medical kit for common cuts, blisters, and burns.",
                "meta": "safety",
            },
        ],
        faqs=[
            (
                "What is semantic filtering good at?",
                "It is good at translating fuzzy intent into a shortlist that structured filters can refine further.",
            ),
            (
                "Should semantic similarity override hard filters?",
                "No. Use it to rank or narrow, but keep hard filters authoritative for rules like availability, compliance, or safety.",
            ),
            (
                "Can I expose the similarity score in the UI?",
                "Sometimes, but many teams use it only behind the scenes and present the effect as 'smart matching' rather than a numeric score.",
            ),
        ],
    ),
]


BENCHMARK_PAGES = [
    BenchmarkPage(
        slug="vs-pinecone",
        competitor="Pinecone",
        summary="Managed vector database versus browser-native retrieval.",
        intro="This comparison is intentionally not framed as a universal winner. Pinecone is infrastructure. altor-vec is a client-side search primitive. The decision starts with where the corpus should live and who should pay the latency cost.",
        runtime=(
            "Browser WebAssembly HNSW running entirely on the client.",
            "Managed vector database accessed over an API.",
        ),
        bundle=(
            "~54KB gzipped library payload plus your vector asset.",
            "No client search bundle, but every query depends on a backend call.",
        ),
        latency=(
            "~0.6ms p95 local ANN lookup on a 10K / 384d benchmark excluding embedding generation.",
            "Usually tens of milliseconds plus network roundtrip, which is acceptable for backend retrieval but not as snappy for keystroke UX.",
        ),
        memory=(
            "Browser memory scales with the shipped corpus; roughly ~17MB for a 10K / 384d representative index.",
            "Server-side memory and storage, with almost nothing held in the browser.",
        ),
        features=(
            "Approximate nearest-neighbor search, serialization, local-first delivery, no hosted ops.",
            "Metadata filtering, namespaces, scaling, backups, observability, and hosted operations.",
        ),
        dataset=(
            "Best for moderate corpora that are safe to ship to the user.",
            "Best for large, private, multi-tenant, or frequently updated corpora.",
        ),
        altor_wins=[
            "Instant local UX without an API dependency.",
            "Zero per-query infrastructure cost after shipping the asset.",
            "Good fit for offline or privacy-sensitive search experiences.",
        ],
        competitor_wins=[
            "Large private datasets and frequent writes.",
            "Operational controls, filtering, and hosted scaling.",
            "Clearer fit for multi-user backend retrieval and production RAG infrastructure.",
        ],
        honest_takeaway="Choose Pinecone when search is part of your backend platform. Choose altor-vec when search is a frontend capability and the corpus is intentionally shipped to the browser.",
        faqs=[
            (
                "Is altor-vec a Pinecone replacement?",
                "Not broadly. They solve different layers of the stack. altor-vec handles local retrieval; Pinecone handles hosted vector infrastructure.",
            ),
            (
                "When does Pinecone clearly win?",
                "When the corpus is large, private, access-controlled, or updated continuously.",
            ),
            (
                "When does altor-vec clearly win?",
                "When the search experience itself belongs in the browser and local latency matters more than backend scale.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-weaviate",
        competitor="Weaviate",
        summary="Feature-rich vector database versus lightweight client-side HNSW.",
        intro="Weaviate brings database-style workflows, modules, and server infrastructure. altor-vec is far narrower, but that narrowness is exactly why it can fit inside a web bundle.",
        runtime=(
            "Browser-side WebAssembly index embedded in the product.",
            "Server-side database with API, schema, and cluster concerns.",
        ),
        bundle=(
            "~54KB gzipped plus data asset.",
            "No browser bundle for ANN, but substantial infrastructure footprint on the server side.",
        ),
        latency=(
            "Sub-millisecond local lookup once loaded.",
            "Typically dominated by network and server response time, but appropriate for central search services.",
        ),
        memory=(
            "Client memory budget matters because vectors live in the session.",
            "Memory pressure moves to the server where larger corpora are more manageable.",
        ),
        features=(
            "ANN retrieval and serialization only.",
            "Filtering, hybrid search, modules, replication, auth, and broader data workflows.",
        ),
        dataset=(
            "Static or moderately sized shipped corpora.",
            "Large shared corpora with write-heavy or backend-centric needs.",
        ),
        altor_wins=[
            "Fits directly in a frontend without provisioning infrastructure.",
            "Works offline and keeps queries on device.",
            "Simple delivery model for docs, widgets, and embedded search.",
        ],
        competitor_wins=[
            "Broader features and operational tooling.",
            "Better fit for complex filtering and multi-tenant datasets.",
            "Stronger choice when embeddings and retrieval are part of a larger backend platform.",
        ],
        honest_takeaway="Weaviate wins on backend capability and scale. altor-vec wins when you want vector retrieval to behave like a frontend dependency, not a service to operate.",
        faqs=[
            (
                "Can I compare bundle size between altor-vec and Weaviate directly?",
                "Only partially. Weaviate is primarily a backend system, so the real tradeoff is delivery model rather than just kilobytes.",
            ),
            (
                "What is the biggest feature gap?",
                "Metadata-rich backend workflows. altor-vec is deliberately not a database.",
            ),
            (
                "What is altor-vec's main advantage here?",
                "You can ship it inside the app and get local search without standing up infrastructure.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-hnswlib-wasm",
        competitor="hnswlib-wasm",
        summary="Two browser-capable HNSW options with different packaging tradeoffs.",
        intro="This is one of the fairest head-to-head comparisons because both tools target approximate nearest-neighbor search in browser-friendly environments. The practical decision often comes down to packaging, ergonomics, and the exact performance profile on your corpus.",
        runtime=(
            "Browser WebAssembly HNSW tuned for a compact client-side package.",
            "Browser-capable HNSW wrapper around hnswlib concepts.",
        ),
        bundle=(
            "~54KB gzipped representative payload.",
            "Often larger packaging footprint depending on build and wrapper details.",
        ),
        latency=(
            "Fast local lookup; benchmark on your corpus because HNSW tuning changes outcomes.",
            "Also fast local lookup with performance shaped by its own index parameters and packaging.",
        ),
        memory=(
            "Browser memory scales with vectors and graph parameters.",
            "Similar browser-memory story; exact overhead depends on implementation details.",
        ),
        features=(
            "Focused ANN API and serialization flow.",
            "Focused ANN API with different integration ergonomics.",
        ),
        dataset=(
            "Frontend search experiences and shipped corpora.",
            "Similar sweet spot: browser-friendly local ANN workloads.",
        ),
        altor_wins=[
            "Smaller delivery target is attractive when bundle budget is the primary constraint.",
            "Straightforward fit for apps that want a narrow API and small payload.",
            "Good default when product teams care most about shipping friction.",
        ],
        competitor_wins=[
            "Developers already invested in hnswlib-style tooling may prefer familiarity.",
            "May perform better on some corpora depending on tuning and implementation details.",
            "Different wrapper choices may fit certain build systems or environments better.",
        ],
        honest_takeaway="If both reach your recall target, frontend ergonomics and payload size become the real decision factors. Benchmark with your own vectors before claiming a winner.",
        faqs=[
            (
                "Which is faster, altor-vec or hnswlib-wasm?",
                "There is no universal answer. HNSW parameter choices, vector dimensions, and the browser runtime all affect the result.",
            ),
            (
                "What tends to decide this comparison in practice?",
                "Bundle size, build tooling, and how easy it is to integrate in a browser app.",
            ),
            (
                "Are these better compared than server databases?",
                "Yes. This is a more direct comparison because both live in the local ANN category.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-usearch",
        competitor="USearch",
        summary="Portable ANN engine versus an aggressively small browser-focused package.",
        intro="USearch is broader and appears across more environments, while altor-vec is narrower and more opinionated around frontend delivery. That means the comparison is less about raw algorithm prestige and more about what you are optimizing for.",
        runtime=(
            "Browser-first WebAssembly ANN runtime.",
            "Portable vector search engine spanning multiple environments and bindings.",
        ),
        bundle=(
            "~54KB gzipped library payload.",
            "Usually a larger or more complex integration depending on target runtime and build choice.",
        ),
        latency=(
            "Very fast local retrieval for shipped browser corpora.",
            "Also optimized for fast ANN; exact wins depend on corpus size, SIMD, and build target.",
        ),
        memory=(
            "Client memory budget remains the limiting factor.",
            "Also constrained by local memory, though different internals may shift the curve.",
        ),
        features=(
            "Purposefully narrow ANN workflow for the browser.",
            "Broader engine ambitions and ecosystem reach beyond a small web-only package.",
        ),
        dataset=(
            "Frontend search and embedded app experiences.",
            "Teams needing a more general ANN engine across runtimes may prefer it.",
        ),
        altor_wins=[
            "Smaller, more justifiable payload for web-product teams.",
            "Opinionated simplicity for client-side delivery.",
            "Good fit when the browser bundle is the product constraint.",
        ],
        competitor_wins=[
            "Broader environment support and engine scope.",
            "Potentially stronger fit outside purely browser-driven use cases.",
            "May appeal to teams optimizing deeply across multiple platforms.",
        ],
        honest_takeaway="USearch is broader. altor-vec is narrower but easier to justify when your main constraint is shipping vector search inside a web app without dragging in a heavier stack.",
        faqs=[
            (
                "Is USearch more powerful than altor-vec?",
                "In scope, yes. But broader scope is not always better when the goal is a tiny, browser-friendly dependency.",
            ),
            (
                "What should frontend teams compare first?",
                "Bundle impact, loading behavior, and whether the integration feels natural in the browser toolchain.",
            ),
            (
                "Can altor-vec still be the better choice if USearch is broader?",
                "Yes. Narrow tools often win when they line up exactly with the product constraint.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-voyager",
        competitor="Voyager",
        summary="Browser-first vector search alternatives with different algorithm and packaging tradeoffs.",
        intro="When both options are already browser-aware, the decision usually becomes empirical. Small differences in packaging, defaults, and recall/latency tradeoffs matter more than sweeping architectural arguments.",
        runtime=(
            "Client-side WASM ANN focused on a small integration surface.",
            "Browser-capable vector search alternative with its own algorithm and packaging assumptions.",
        ),
        bundle=(
            "~54KB gzipped representative payload.",
            "Often somewhat larger depending on packaging and chosen build output.",
        ),
        latency=(
            "Fast local lookups intended for interactive frontend UX.",
            "Also optimized for local search; benchmark directly because browser performance is corpus-specific.",
        ),
        memory=(
            "Index lives in client memory.",
            "Similar client-memory story with implementation-specific overhead.",
        ),
        features=(
            "Compact ANN API and serialized local index workflow.",
            "Competing browser vector search capabilities with different integration choices.",
        ),
        dataset=(
            "Moderate corpora bundled into the app.",
            "Similar browser-delivered dataset sizes.",
        ),
        altor_wins=[
            "Small payload and simple API shape.",
            "Strong fit when browser delivery friction is the first concern.",
            "Good option for teams that want minimal surface area.",
        ],
        competitor_wins=[
            "May hit better recall or latency on some corpora.",
            "Alternative algorithmic tradeoffs could suit certain embedding distributions better.",
            "Existing user familiarity may reduce switching costs.",
        ],
        honest_takeaway="At this tier, benchmark on your own corpus. Developer experience, bundle budget, and how predictable the results feel in the browser often decide more than theory alone.",
        faqs=[
            (
                "Is one clearly better than the other?",
                "Not without a corpus-specific benchmark. Browser ANN comparisons are highly dependent on vector shape and index parameters.",
            ),
            (
                "What matters more than theoretical speed?",
                "How easy it is to ship, load, and operate in the product bundle.",
            ),
            (
                "Why can a smaller library win even if raw performance is similar?",
                "Because frontend teams also pay in startup time, build complexity, and maintenance overhead.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-faiss-wasm",
        competitor="FAISS WASM",
        summary="Research-grade ANN lineage versus a small production-friendly browser package.",
        intro="FAISS carries a strong reputation because of its research and systems lineage. The tradeoff is that reputation does not automatically translate into the smallest or easiest frontend package for browser delivery.",
        runtime=(
            "Browser-side WASM HNSW for shipped app experiences.",
            "WebAssembly adaptation of a famously capable ANN toolkit.",
        ),
        bundle=(
            "~54KB gzipped representative payload.",
            "Often larger and more complex to ship in the browser.",
        ),
        latency=(
            "Fast local retrieval with modest startup cost.",
            "Potentially strong raw performance, but browser packaging and startup overhead can matter more in product UX.",
        ),
        memory=(
            "Designed for browser-scale corpora, so memory budget is an explicit constraint.",
            "Memory behavior depends on the chosen FAISS index strategy and compiled target.",
        ),
        features=(
            "Focused ANN search and serialization.",
            "Much broader family of ANN approaches and tuning options.",
        ),
        dataset=(
            "Browser-bundled corpora where operational simplicity matters.",
            "Teams that need FAISS-style breadth or experimentation may prefer it.",
        ),
        altor_wins=[
            "Much easier payload story for web delivery.",
            "Narrower API reduces integration overhead.",
            "Better match when product teams want 'small and sufficient' rather than maximum breadth.",
        ],
        competitor_wins=[
            "Broader algorithmic toolbox and deeper ANN lineage.",
            "Potentially better fit for advanced experimentation.",
            "Stronger appeal to teams already familiar with FAISS workflows.",
        ],
        honest_takeaway="FAISS wins on breadth and lineage. altor-vec wins on browser pragmatism and small-package delivery.",
        faqs=[
            (
                "Is FAISS WASM always better because FAISS is famous?",
                "Not for frontend delivery. Browser products care about payload and integration overhead just as much as raw ANN credibility.",
            ),
            (
                "When should I still pick FAISS WASM?",
                "When you specifically need its broader algorithm family or are already invested in FAISS-style workflows.",
            ),
            (
                "What is altor-vec optimizing for instead?",
                "A focused, lightweight browser experience with minimal bundle cost.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-chromadb",
        competitor="ChromaDB",
        summary="Application database for embeddings versus static browser retrieval.",
        intro="ChromaDB is often chosen as an application-side store for embeddings and metadata, while altor-vec is closer to a shipped frontend primitive. Comparing them usefully means being honest about that mismatch.",
        runtime=(
            "Local browser ANN runtime.",
            "Server-side application database or local dev database workflow.",
        ),
        bundle=(
            "~54KB gzipped plus index asset.",
            "No browser ANN payload, but the app depends on a running service or server environment.",
        ),
        latency=(
            "Sub-millisecond local lookup after load.",
            "Server or local process latency plus request overhead depending on deployment model.",
        ),
        memory=(
            "Client memory consumed by shipped vectors.",
            "Memory and storage handled in the application backend or local environment.",
        ),
        features=(
            "ANN retrieval and serialization.",
            "Collections, metadata, persistence, and app-database style workflows.",
        ),
        dataset=(
            "Best for static corpora that belong in the shipped frontend.",
            "Better for mutable app datasets and server-managed retrieval.",
        ),
        altor_wins=[
            "No search server to run or pay for.",
            "Excellent fit for embedded widgets, docs, and offline experiences.",
            "Queries can stay fully local.",
        ],
        competitor_wins=[
            "Much better fit for mutable datasets and application storage patterns.",
            "More natural for backend RAG stacks.",
            "Easier to centralize data instead of shipping it.",
        ],
        honest_takeaway="ChromaDB is stronger as an application data layer. altor-vec is stronger as a browser-delivered retrieval primitive.",
        faqs=[
            (
                "Can altor-vec replace ChromaDB in a backend RAG system?",
                "Usually no. ChromaDB is better suited to server-managed mutable datasets and backend workflows.",
            ),
            (
                "When is altor-vec clearly better?",
                "When the corpus is safe to ship and the retrieval experience belongs directly in the frontend.",
            ),
            (
                "Why compare them at all?",
                "Because teams sometimes conflate 'vector search tool' categories even though the operational models are very different.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-lance",
        competitor="Lance",
        summary="Columnar/vector data platform tradeoffs versus browser-native ANN.",
        intro="Lance is not just an ANN library; it sits closer to a data format and platform story. That makes it powerful for data-heavy workflows, but it also means it is solving a broader problem than a tiny browser vector dependency.",
        runtime=(
            "In-browser ANN runtime for shipped apps.",
            "Vector-aware data platform and file-format ecosystem used in data and backend workflows.",
        ),
        bundle=(
            "~54KB gzipped library payload.",
            "Broader integration footprint because the value proposition goes beyond a tiny browser bundle.",
        ),
        latency=(
            "Interactive local lookup in the browser.",
            "Good performance in data-platform contexts, but not optimized around the same frontend-delivery constraint.",
        ),
        memory=(
            "Browser memory is the main limit.",
            "Designed for larger data workflows where storage and access patterns differ from a shipped web asset.",
        ),
        features=(
            "Focused ANN search and serialization.",
            "Broader table, storage, and vector ecosystem capabilities.",
        ),
        dataset=(
            "Curated corpora bundled into web apps.",
            "Teams working with larger vector datasets and data-engineering style workflows.",
        ),
        altor_wins=[
            "Much simpler when the goal is just local browser retrieval.",
            "Smaller payload and fewer moving parts.",
            "No data-platform adoption step required.",
        ],
        competitor_wins=[
            "Broader data workflow story.",
            "Better fit for teams treating vectors as part of a larger analytical dataset.",
            "Stronger option when browser delivery is not the main constraint.",
        ],
        honest_takeaway="Lance is more compelling when you are building a vector-aware data stack. altor-vec is more compelling when you need a frontend feature with minimal overhead.",
        faqs=[
            (
                "Is Lance overkill for browser-only search?",
                "It can be, depending on your needs. If you just want a small client-side ANN layer, a narrow library is often easier to justify.",
            ),
            (
                "When does Lance make more sense?",
                "When vectors are part of a broader data storage and pipeline story rather than just a frontend capability.",
            ),
            (
                "What is altor-vec's advantage here?",
                "Low-friction delivery for app-embedded search.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="vs-milvus-lite",
        competitor="Milvus Lite",
        summary="Embedded/server vector database tradeoffs versus fully in-browser retrieval.",
        intro="Milvus Lite narrows the gap between heavyweight database infrastructure and lightweight local experimentation, but it still occupies a different place in the stack than a browser bundle you ship to every user.",
        runtime=(
            "Client-side WebAssembly ANN in the user's browser.",
            "Embedded or lightweight database-style vector runtime outside the normal browser-delivery model.",
        ),
        bundle=(
            "~54KB gzipped plus vector asset.",
            "Not typically framed as a tiny client bundle; deployment model is closer to an embedded or server-side service.",
        ),
        latency=(
            "Immediate local lookup for the current session.",
            "Fast in its own environment, but not aimed at the exact same in-browser interaction pattern.",
        ),
        memory=(
            "Client memory bound by the shipped corpus.",
            "Memory managed by the embedded or server runtime instead of the browser tab.",
        ),
        features=(
            "ANN retrieval and serialization only.",
            "Database-style vector storage and operational patterns beyond a small browser primitive.",
        ),
        dataset=(
            "Safe-to-ship, moderate-size corpora.",
            "Larger or more mutable datasets where database semantics matter.",
        ),
        altor_wins=[
            "True browser-native delivery.",
            "Offline-capable local UX.",
            "No service boundary between the UI and search.",
        ],
        competitor_wins=[
            "Better fit for mutable and backend-managed data.",
            "More database-like operational model.",
            "Stronger when the dataset should not be bundled into the client.",
        ],
        honest_takeaway="Milvus Lite is closer to embedded database infrastructure. altor-vec is closer to a frontend dependency. The right choice depends on which role you actually need.",
        faqs=[
            (
                "Why compare Milvus Lite and altor-vec?",
                "Because both may appear 'lightweight' compared with large hosted systems, but they still target different runtime models.",
            ),
            (
                "When is Milvus Lite the better fit?",
                "When you need database semantics or local/server-side storage that should not be bundled into the browser.",
            ),
            (
                "When is altor-vec the better fit?",
                "When the end product is a browser app that should search locally without another runtime boundary.",
            ),
        ],
    ),
    BenchmarkPage(
        slug="browser-vs-server",
        competitor="Server-Side Vector Search",
        summary="When local browser retrieval wins and when server-side retrieval clearly wins.",
        intro="This is the umbrella tradeoff behind every individual comparison page. Browser vector search and server vector search are both useful, but they optimize different things: one optimizes delivery and local UX, the other optimizes centralized control and scale.",
        runtime=(
            "Index runs in the browser session next to the UI.",
            "Index runs on a server, managed service, or database cluster.",
        ),
        bundle=(
            "You ship the library and corpus to the client.",
            "You ship little or nothing to the client, but every query traverses the network.",
        ),
        latency=(
            "Best-case interactive latency because the search is local.",
            "Higher floor because network is part of every query, but better for central shared corpora.",
        ),
        memory=(
            "Client pays the memory cost.",
            "Server pays the memory and storage cost.",
        ),
        features=(
            "Great for offline, privacy, and embedded UX; weak for centralized operations.",
            "Great for writes, ACLs, filtering, observability, and shared large datasets.",
        ),
        dataset=(
            "Safe-to-ship, moderate-size, mostly static corpora.",
            "Private, massive, multi-user, or fast-changing corpora.",
        ),
        altor_wins=[
            "Offline and low-latency UX.",
            "Zero per-query API dependency.",
            "Simple architecture for frontend-owned search experiences.",
        ],
        competitor_wins=[
            "Large mutable datasets.",
            "Access control and backend integration.",
            "Centralized logging, scaling, and team operations.",
        ],
        honest_takeaway="Browser search wins when retrieval is part of the interface itself. Server search wins when retrieval is part of the infrastructure. Most teams should choose based on that boundary first, not on raw ANN marketing claims.",
        faqs=[
            (
                "Can browser search replace server search completely?",
                "Only for the subset of use cases where the corpus is safe to ship and moderate in size.",
            ),
            (
                "What is the biggest advantage of server-side search?",
                "Control: private data, writes, filtering, observability, and shared infrastructure.",
            ),
            (
                "What is the biggest advantage of browser-side search?",
                "Local latency and product simplicity. The UI can search instantly without asking another service for every interaction.",
            ),
        ],
    ),
]


def indent(text: str, spaces: int = 2) -> str:
    return textwrap.indent(text.strip(), " " * spaces)


def html_page(
    title: str,
    description: str,
    canonical: str,
    body: str,
    schema: list[dict[str, object]],
) -> str:
    schema_json = json.dumps(
        schema if len(schema) > 1 else schema[0], ensure_ascii=False
    )
    return f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">
  <title>{escape(title)}</title>
  <meta name=\"description\" content=\"{escape(description)}\">
  <link rel=\"canonical\" href=\"{escape(canonical)}\">
  <style>{STYLE}</style>
  <script type=\"application/ld+json\">{schema_json}</script>
</head>
<body>
{body}
</body>
</html>
"""


def build_js_example(page: ExamplePage) -> str:
    records_json = json.dumps(page.records, indent=2, ensure_ascii=False)
    return textwrap.dedent(
        f"""
        import init, {{ WasmSearchEngine }} from 'altor-vec';

        const dims = 12;
        const records = {records_json};

        {EMBED_FUNCTION}

        async function main() {{
          await init();

          const flat = new Float32Array(
            records.flatMap((record) => embedText(`${{record.title}} ${{record.text}} ${{record.meta}}`))
          );

          const engine = WasmSearchEngine.from_vectors(flat, dims, 16, 200, 64);
          const hits = JSON.parse(engine.search(new Float32Array(embedText('{page.sample_query}')), 4));

          const results = hits.map(([id, distance]) => ({{
            ...records[id],
            similarity: Number((1 - distance).toFixed(3)),
          }}));

          console.table(results);
          engine.free();
        }}

        main();
        """
    ).strip()


def build_react_example(page: ExamplePage) -> str:
    records_json = json.dumps(page.records, indent=2, ensure_ascii=False)
    component_name = "".join(part.title() for part in page.slug.split("-")) + "Example"
    return textwrap.dedent(
        f"""
        import {{ useEffect, useState }} from 'react';
        import init, {{ WasmSearchEngine }} from 'altor-vec';

        const dims = 12;
        const records = {records_json};

        {EMBED_FUNCTION}

        export function {component_name}() {{
          const [engine, setEngine] = useState(null);
          const [query, setQuery] = useState('');
          const [results, setResults] = useState([]);

          useEffect(() => {{
            let cancelled = false;
            let instance;

            (async () => {{
              await init();
              const flat = new Float32Array(
                records.flatMap((record) => embedText(`${{record.title}} ${{record.text}} ${{record.meta}}`))
              );
              instance = WasmSearchEngine.from_vectors(flat, dims, 16, 200, 64);
              if (!cancelled) setEngine(instance);
            }})();

            return () => {{
              cancelled = true;
              instance?.free();
            }};
          }}, []);

          useEffect(() => {{
            if (!engine || query.trim().length < 2) {{
              setResults([]);
              return;
            }}

            const hits = JSON.parse(engine.search(new Float32Array(embedText(query)), 5));
            setResults(
              hits.map(([id, distance]) => ({{
                ...records[id],
                similarity: Number((1 - distance).toFixed(3)),
              }}))
            );
          }}, [engine, query]);

          return (
            <section>
              <input
                value={{query}}
                onChange={{(event) => setQuery(event.target.value)}}
                placeholder=\"{page.placeholder}\"
              />
              <ul>
                {{results.map((result) => (
                  <li key={{result.title}}>
                    <strong>{{result.title}}</strong> — {{result.meta}} (score {{result.similarity}})
                  </li>
                ))}}
              </ul>
            </section>
          );
        }}
        """
    ).strip()


def render_faq_section(faqs: list[tuple[str, str]]) -> str:
    items = []
    for question, answer in faqs:
        items.append(f"<h3>{escape(question)}</h3>\n<p>{escape(answer)}</p>")
    return "\n".join(items)


def render_example_page(page: ExamplePage) -> str:
    js_code = escape(build_js_example(page))
    react_code = escape(build_react_example(page))
    use_case_items = "".join(f"<li>{escape(item)}</li>" for item in page.use_cases)
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {"@type": "Answer", "text": answer},
            }
            for question, answer in page.faqs
        ],
    }
    article_schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": f"{page.name} with altor-vec",
        "datePublished": LASTMOD,
        "dateModified": LASTMOD,
        "author": {"@type": "Organization", "name": "AltorLab"},
        "publisher": {"@type": "Organization", "name": "AltorLab"},
        "url": f"{BASE_URL}/examples/{page.slug}.html",
    }
    body = f"""
<nav><a href=\"/\">← altor-vec</a> · <a href=\"/examples/\">Examples</a></nav>
<article>
  <p class=\"kicker\">code example</p>
  <h1>Build {escape(page.name)} with altor-vec</h1>
  <p><strong>What this pattern solves:</strong> {escape(page.summary)}</p>
  <p>{escape(page.challenge)}</p>
  <p>{escape(page.why_local)}</p>

  <h2>Install</h2>
  <pre><code>npm install altor-vec</code></pre>

  <h2>Concept explanation</h2>
  <p>In a {escape(page.name.lower())} workflow, users usually describe intent in their own words. That is why vector search works well here: each record is turned into an embedding, the embeddings are indexed once, and later queries retrieve the nearest semantic neighbors instead of relying only on exact tokens. In practice this means the interface can respond to paraphrases, shorthand, and partial descriptions far better than a literal-only search box.</p>
  <p>The browser is often the right place to do this when the corpus is moderate in size and safe to ship. The instant benefit is lower latency. The architectural benefit is that you remove a whole search service from the request path. That matters for keystroke-heavy interactions, offline-capable apps, and product surfaces where search should feel like a UI primitive rather than a network round trip.</p>
  <p>This page uses a deterministic embedding helper so the sample is runnable with only <code>altor-vec</code> installed. That keeps the example honest and easy to paste into a demo project. {escape(page.production_note)}</p>
  <div class=\"callout small\">Representative browser benchmark: ~54KB gzipped library payload, sub-millisecond local query time on a moderate corpus, and no per-query API dependency. Exact numbers depend on vector dimensions, index parameters, and device class.</div>

  <h2>Runnable JavaScript example</h2>
  <p>The following snippet indexes a small in-memory dataset, performs a semantic lookup for <code>{escape(page.sample_query)}</code>, and prints the nearest matches. It uses the real <code>altor-vec</code> API, including <code>init()</code>, <code>WasmSearchEngine.from_vectors()</code>, and <code>search()</code>.</p>
  <pre><code>{js_code}</code></pre>

  <h2>React component version</h2>
  <p>The React version keeps the same index build but wires it into component state so the UI can query on input changes. That is usually how teams introduce semantic retrieval into an existing product: initialize once, keep the engine in memory, and map nearest-neighbor hits back to the original records.</p>
  <pre><code>{react_code}</code></pre>

  <h2>How this example works</h2>
  <p>The pattern has three moving parts. First, you choose what text represents each record: title, description, metadata, or a chunk of content. Second, you turn that text into vectors and flatten them into one <code>Float32Array</code>. Third, you build the HNSW graph and query it with a vector created from the user input. The library returns nearest-neighbor IDs and distances, and your app decides how to display or post-process them.</p>
  <p>Because the retrieval step is approximate nearest-neighbor search, it stays fast even as the dataset grows beyond trivial linear scans. The most important quality lever is still the embedding model. Better vectors usually matter more than micro-optimizing ANN parameters, so teams should benchmark retrieval quality on real user phrasing before shipping the experience widely.</p>

  <h2>When to use this pattern</h2>
  <p>This is a practical fit when the search corpus is small to medium, shipped with the app, and searched frequently enough that backend latency would be noticeable. Common examples include docs portals, embedded support widgets, local-first assistants, and curated catalogs.</p>
  <ul>{use_case_items}</ul>

  <h2>Limitations</h2>
  <p>{escape(page.limitations)}</p>
  <p>Be especially careful about corpus size, update frequency, and data sensitivity. Browser vector search is excellent when those three constraints are favorable, but it is not the right answer when the dataset is huge, private, or changing constantly for every user.</p>

  <h2>FAQ</h2>
  {render_faq_section(page.faqs)}

  <p><strong>Get started:</strong> <code>npm install altor-vec</code> · <a href=\"https://github.com/Altor-lab/altor-vec\">GitHub</a></p>
</article>
""".strip()
    description = f"Build {page.name.lower()} with altor-vec using a real runnable JavaScript example, React component, and browser-side vector search architecture notes."
    return html_page(
        title=f"{page.name} with altor-vec — Code Example | altorlab.dev",
        description=description,
        canonical=f"{BASE_URL}/examples/{page.slug}.html",
        body=body,
        schema=[article_schema, faq_schema],
    )


def render_examples_index() -> str:
    cards = []
    rows = []
    for page in EXAMPLE_PAGES:
        cards.append(
            f'<a class="card" href="/examples/{page.slug}.html"><strong>{escape(page.name)}</strong><p>{escape(page.summary)}</p></a>'
        )
        rows.append(
            f'<tr><td><a href="/examples/{page.slug}.html">{escape(page.name)}</a></td><td>{escape(page.summary)}</td></tr>'
        )
    body = f"""
<nav><a href=\"/\">← altor-vec</a></nav>
<main>
  <p class=\"kicker\">examples</p>
  <h1>altor-vec code examples</h1>
  <p>These static HTML pages show realistic client-side vector search patterns for altor-vec. Every page includes a runnable JavaScript example, a React component version, an honest limitations section, and FAQ schema for long-tail search coverage.</p>
  <h2>Browse all 15 code example pages</h2>
  <div class=\"card-grid\">{"".join(cards)}</div>
  <h2>Summary table</h2>
  <table>
    <thead><tr><th>Example</th><th>What it demonstrates</th></tr></thead>
    <tbody>{"".join(rows)}</tbody>
  </table>
</main>
""".strip()
    return html_page(
        title="altor-vec Code Examples | altorlab.dev",
        description="15 altor-vec code examples covering autocomplete, RAG retrieval, offline search, recommendations, privacy-preserving retrieval, and more.",
        canonical=f"{BASE_URL}/examples/",
        body=body,
        schema=[
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "altor-vec code examples",
                "url": f"{BASE_URL}/examples/",
            }
        ],
    )


def render_benchmark_page(page: BenchmarkPage) -> str:
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {"@type": "Answer", "text": answer},
            }
            for question, answer in page.faqs
        ],
    }
    article_schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": f"altor-vec vs {page.competitor}",
        "datePublished": LASTMOD,
        "dateModified": LASTMOD,
        "author": {"@type": "Organization", "name": "AltorLab"},
        "url": f"{BASE_URL}/benchmarks/{page.slug}.html",
    }
    altor_wins = "".join(f"<li>{escape(item)}</li>" for item in page.altor_wins)
    competitor_wins = "".join(
        f"<li>{escape(item)}</li>" for item in page.competitor_wins
    )
    body = f"""
<nav><a href=\"/\">← altor-vec</a> · <a href=\"/benchmarks/\">Benchmarks</a></nav>
<article>
  <p class=\"kicker\">benchmark comparison</p>
  <h1>altor-vec vs {escape(page.competitor)}</h1>
  <p>{escape(page.summary)}</p>
  <p>{escape(page.intro)}</p>
  <div class=\"note small\">These numbers are representative, not universal. Bundle size, query latency, and memory usage all vary with vector dimensions, index parameters, browser runtime, hardware, and whether embeddings are generated on device or ahead of time.</div>

  <h2>Comparison table</h2>
  <table>
    <thead>
      <tr><th>Category</th><th>altor-vec</th><th>{escape(page.competitor)}</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Runtime model</strong></td><td>{escape(page.runtime[0])}</td><td>{escape(page.runtime[1])}</td></tr>
      <tr><td><strong>Bundle size / delivery</strong></td><td>{escape(page.bundle[0])}</td><td>{escape(page.bundle[1])}</td></tr>
      <tr><td><strong>Query latency</strong></td><td>{escape(page.latency[0])}</td><td>{escape(page.latency[1])}</td></tr>
      <tr><td><strong>Memory usage</strong></td><td>{escape(page.memory[0])}</td><td>{escape(page.memory[1])}</td></tr>
      <tr><td><strong>Features</strong></td><td>{escape(page.features[0])}</td><td>{escape(page.features[1])}</td></tr>
      <tr><td><strong>Dataset sweet spot</strong></td><td>{escape(page.dataset[0])}</td><td>{escape(page.dataset[1])}</td></tr>
    </tbody>
  </table>

  <h2>Where altor-vec wins</h2>
  <ul>{altor_wins}</ul>

  <h2>Where {escape(page.competitor)} wins</h2>
  <ul>{competitor_wins}</ul>

  <h2>Honest decision guide</h2>
  <p>{escape(page.honest_takeaway)}</p>
  <p>The honest pattern across all of these benchmark pages is simple: if the search corpus should stay on the server, choose server-oriented infrastructure. If the search corpus is intentionally shipped with the product and the UX benefit of local retrieval matters more than backend scale, altor-vec is usually the more natural fit.</p>

  <h2>FAQ</h2>
  {render_faq_section(page.faqs)}

  <p><strong>Get started:</strong> <code>npm install altor-vec</code> · <a href=\"https://github.com/Altor-lab/altor-vec\">GitHub</a></p>
</article>
""".strip()
    return html_page(
        title=f"altor-vec vs {page.competitor} — Honest Comparison | altorlab.dev",
        description=f"Honest altor-vec vs {page.competitor} comparison covering bundle size, latency, memory usage, features, and where each approach wins.",
        canonical=f"{BASE_URL}/benchmarks/{page.slug}.html",
        body=body,
        schema=[article_schema, faq_schema],
    )


def render_benchmarks_index() -> str:
    cards = []
    rows = []
    for page in BENCHMARK_PAGES:
        cards.append(
            f'<a class="card" href="/benchmarks/{page.slug}.html"><strong>{escape(page.competitor)}</strong><p>{escape(page.summary)}</p></a>'
        )
        rows.append(
            f'<tr><td><a href="/benchmarks/{page.slug}.html">{escape(page.competitor)}</a></td><td>{escape(page.summary)}</td><td>{escape(page.honest_takeaway)}</td></tr>'
        )
    body = f"""
<nav><a href=\"/\">← altor-vec</a></nav>
<main>
  <p class=\"kicker\">benchmarks</p>
  <h1>altor-vec benchmark comparisons</h1>
  <p>These pages compare altor-vec with hosted vector databases, embedded engines, and browser-capable alternatives. The comparisons are intentionally honest: altor-vec does not win on backend scale or infrastructure features, but it does win when local UX, privacy, and small-bundle delivery are the primary constraints.</p>
  <h2>Browse all 10 benchmark pages</h2>
  <div class=\"card-grid\">{"".join(cards)}</div>
  <h2>Summary table</h2>
  <table>
    <thead><tr><th>Comparison</th><th>What is being compared</th><th>Short takeaway</th></tr></thead>
    <tbody>{"".join(rows)}</tbody>
  </table>
</main>
""".strip()
    return html_page(
        title="altor-vec Benchmark Comparisons | altorlab.dev",
        description="10 honest benchmark comparison pages covering altor-vec versus Pinecone, Weaviate, hnswlib-wasm, FAISS WASM, ChromaDB, and more.",
        canonical=f"{BASE_URL}/benchmarks/",
        body=body,
        schema=[
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "altor-vec benchmark comparisons",
                "url": f"{BASE_URL}/benchmarks/",
            }
        ],
    )


def write_pages() -> None:
    EXAMPLES_DIR.mkdir(parents=True, exist_ok=True)
    BENCHMARKS_DIR.mkdir(parents=True, exist_ok=True)
    for page in EXAMPLE_PAGES:
        (EXAMPLES_DIR / f"{page.slug}.html").write_text(
            render_example_page(page), encoding="utf-8"
        )
    (EXAMPLES_DIR / "index.html").write_text(render_examples_index(), encoding="utf-8")
    for page in BENCHMARK_PAGES:
        (BENCHMARKS_DIR / f"{page.slug}.html").write_text(
            render_benchmark_page(page), encoding="utf-8"
        )
    (BENCHMARKS_DIR / "index.html").write_text(
        render_benchmarks_index(), encoding="utf-8"
    )


def update_sitemap() -> None:
    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    ET.register_namespace("", namespace["sm"])

    def loc_text(url_element: ET.Element) -> str:
        loc = url_element.find("sm:loc", namespace)
        return loc.text if loc is not None and loc.text else ""

    def ensure_child(url_element: ET.Element, tag: str) -> ET.Element:
        child = url_element.find(f"sm:{tag}", namespace)
        if child is None:
            child = ET.SubElement(url_element, f"{{{namespace['sm']}}}{tag}")
        return child

    existing = {loc_text(url): url for url in root.findall("sm:url", namespace)}

    stale_urls = []
    for loc in existing:
        if (
            loc.startswith(f"{BASE_URL}/examples/")
            and not loc.endswith(".html")
            and not loc.endswith("/examples/")
        ):
            stale_urls.append(loc)
        if (
            loc.startswith(f"{BASE_URL}/benchmarks/")
            and not loc.endswith(".html")
            and not loc.endswith("/benchmarks/")
        ):
            stale_urls.append(loc)
    for loc in stale_urls:
        root.remove(existing[loc])

    desired = [
        (f"{BASE_URL}/examples/", "0.8"),
        (f"{BASE_URL}/benchmarks/", "0.8"),
        *[(f"{BASE_URL}/examples/{page.slug}.html", "0.7") for page in EXAMPLE_PAGES],
        *[
            (f"{BASE_URL}/benchmarks/{page.slug}.html", "0.7")
            for page in BENCHMARK_PAGES
        ],
    ]

    for loc, priority in desired:
        url = existing.get(loc)
        if url is None:
            url = ET.SubElement(root, f"{{{namespace['sm']}}}url")
        ensure_child(url, "loc").text = loc
        ensure_child(url, "lastmod").text = LASTMOD
        ensure_child(url, "changefreq").text = "monthly"
        ensure_child(url, "priority").text = priority

    xml = ET.tostring(root, encoding="unicode")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml
    SITEMAP_PATH.write_text(xml + "\n", encoding="utf-8")


def main() -> None:
    write_pages()
    update_sitemap()
    print(
        f"Generated {len(EXAMPLE_PAGES)} example pages, {len(BENCHMARK_PAGES)} benchmark pages, and updated sitemap.xml"
    )


if __name__ == "__main__":
    main()
