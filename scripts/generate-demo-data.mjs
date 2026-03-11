/**
 * Generates a pre-built altor-vec index and pre-computed query embeddings
 * for the live website demo. Uses simple normalized term-frequency vectors
 * (no external API needed) over a vocabulary of 64 technical terms.
 *
 * Outputs:
 *   public/demo-index.bin  -- serialized HNSW index
 *   src/demo-data.ts       -- query embeddings + document metadata
 */

import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load the WASM module synchronously via Node
const wasmPath = path.join(
  __dirname,
  "../node_modules/altor-vec/altor_vec_wasm_bg.wasm"
);
const wasmBytes = readFileSync(wasmPath);

// Import the JS glue
const altorVec = await import("altor-vec");
await altorVec.default({ module_or_path: wasmBytes });
const { WasmSearchEngine } = altorVec;

// ---------------------------------------------------------------------------
// Vocabulary: 64 dimensions covering common developer/search topics
// ---------------------------------------------------------------------------
const VOCAB = [
  // JS/TS ecosystem
  "javascript", "typescript", "node", "npm", "webpack", "vite", "react",
  "nextjs", "vue", "svelte",
  // Backend
  "api", "rest", "graphql", "websocket", "http", "server", "database",
  "postgres", "redis", "authentication",
  // Performance
  "performance", "latency", "memory", "cache", "wasm", "webassembly",
  "rust", "simd", "benchmark", "optimization",
  // Search
  "search", "vector", "embedding", "semantic", "hnsw", "index", "query",
  "similarity", "nearest", "retrieval",
  // Dev workflow
  "deploy", "docker", "ci", "testing", "debug", "error", "logging",
  "monitoring", "configuration", "environment",
  // Security
  "oauth", "jwt", "token", "encryption", "cors", "csrf", "rate",
  "limit", "permission", "privacy",
  // Data
  "json", "binary", "float", "array", "buffer",
];

const DIMS = VOCAB.length; // 64

function textToVector(text) {
  const lower = text.toLowerCase();
  const vec = new Float32Array(DIMS);
  for (let i = 0; i < VOCAB.length; i++) {
    const word = VOCAB[i];
    // Count occurrences with word-boundary awareness
    let count = 0;
    let pos = 0;
    while ((pos = lower.indexOf(word, pos)) !== -1) {
      count++;
      pos += word.length;
    }
    vec[i] = count;
  }
  // L2 normalize
  let norm = 0;
  for (let i = 0; i < DIMS; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < DIMS; i++) vec[i] /= norm;
  return vec;
}

// ---------------------------------------------------------------------------
// Demo documents: realistic developer docs topics
// ---------------------------------------------------------------------------
const DOCS = [
  // WASM / altor-vec
  {
    title: "Getting Started with altor-vec",
    snippet:
      "Install altor-vec via npm. Load the WASM binary, build or load a pre-built HNSW index, then call engine.search() with a query vector.",
    text: "altor-vec wasm webassembly vector search hnsw index npm install javascript typescript quick start getting started",
  },
  {
    title: "Building a Search Index",
    snippet:
      "Use WasmSearchEngine.from_vectors() to build an HNSW index from a flat Float32Array. Tune M (connections per node) and ef_construction for recall vs. build speed.",
    text: "hnsw index build from_vectors float32array vector embedding dimensions construction binary serialize",
  },
  {
    title: "Running Search Queries",
    snippet:
      "Call engine.search(queryVector, topK) to get the nearest neighbors. Returns JSON [[nodeId, distance], ...]. Typical p95 latency: 0.6ms for 10K vectors.",
    text: "search query vector nearest neighbor similarity distance latency performance wasm webassembly benchmark",
  },
  {
    title: "Web Worker Integration",
    snippet:
      "Run altor-vec in a Web Worker to keep the main thread free. Post messages to init the engine and search. Recommended for production.",
    text: "web worker javascript thread performance async init message search worker production react nextjs",
  },
  {
    title: "Serializing and Loading an Index",
    snippet:
      "Call engine.to_bytes() to export the index as a Uint8Array. Store it as a .bin file on your CDN. Load with new WasmSearchEngine(bytes).",
    text: "serialize binary bytes buffer cdn deploy index load save uint8array wasm storage",
  },
  {
    title: "Choosing Embedding Dimensions",
    snippet:
      "all-MiniLM-L6-v2 produces 384-dimension embeddings. text-embedding-3-small uses 1536 dimensions. Larger dims improve recall but increase index size and search latency.",
    text: "embedding dimensions model minilm openai cohere vector float32array search recall latency size",
  },
  {
    title: "HNSW Parameters: M, ef_construction, ef_search",
    snippet:
      "M controls connections per node (higher = better recall, more RAM). ef_construction controls build-time beam width. ef_search controls query-time recall vs. speed.",
    text: "hnsw parameters m ef_construction ef_search recall precision latency graph connections optimization tuning",
  },
  {
    title: "Fully Client-side Search with Transformers.js",
    snippet:
      "Combine altor-vec with Transformers.js (Xenova/all-MiniLM-L6-v2) for zero-server semantic search — embeddings and retrieval both run in the browser.",
    text: "transformers javascript embedding model browser client side semantic search wasm webassembly privacy offline",
  },
  {
    title: "Privacy-first Search: Data Never Leaves the Browser",
    snippet:
      "Because search runs locally via WASM, no query or document data is sent to a third-party server. Ideal for sensitive docs, internal tools, and privacy-first products.",
    text: "privacy security data browser client local wasm cors server third party sensitive internal",
  },
  {
    title: "TypeScript Types and API Reference",
    snippet:
      "altor-vec ships with full TypeScript declarations. WasmSearchEngine methods: constructor(bytes), from_vectors(), search(), add_vectors(), to_bytes(), len(), free().",
    text: "typescript types api reference wasm search engine constructor methods declaration npm package",
  },
  // Auth
  {
    title: "OAuth 2.0 Authentication Flow",
    snippet:
      "Implement OAuth 2.0 with PKCE for browser-based applications. Exchange the authorization code for tokens and store them securely in memory.",
    text: "oauth jwt token authentication authorization pkce flow browser security permission scope",
  },
  {
    title: "Managing API Keys",
    snippet:
      "Create, rotate, and revoke API keys from the dashboard. Set per-key rate limits, scope restrictions, and expiry dates.",
    text: "api key authentication token rate limit permission environment configuration security",
  },
  // Performance
  {
    title: "Optimizing WASM Load Time",
    snippet:
      "Preload the WASM binary with <link rel=preload>. Use streaming instantiation. Cache in a Service Worker for offline support.",
    text: "wasm webassembly load performance cache service worker preload optimization latency memory",
  },
  {
    title: "Caching Search Results",
    snippet:
      "Memoize recent queries using a Map. Cache the index in IndexedDB for instant reload. Measure cache hit rate to tune your cache size.",
    text: "cache redis memory performance latency optimization query result memoize indexeddb",
  },
  // Config
  {
    title: "Environment Variables and Configuration",
    snippet:
      "Use .env files for local development. Never commit API keys. Use CI/CD secrets for production deployments.",
    text: "environment configuration deploy ci docker node secret api key error debug logging",
  },
  {
    title: "Error Handling Best Practices",
    snippet:
      "Wrap WASM calls in try/catch. Handle the WASM init promise rejection. Log errors with context. Return graceful fallbacks when search fails.",
    text: "error handling debug logging monitoring javascript typescript try catch wasm promise",
  },
  // Deployment
  {
    title: "Deploying to Vercel / Netlify",
    snippet:
      "Place your index.bin in the public/ folder. Set correct MIME types for .wasm files. Use edge caching for the WASM binary.",
    text: "deploy vercel netlify docker cdn binary wasm configuration http server cache",
  },
  {
    title: "Rate Limiting and Quotas",
    snippet:
      "With altor-vec there are no server-side rate limits — search runs locally. For the embedding pipeline, respect OpenAI and Cohere API rate limits.",
    text: "rate limit quota api server http error retry latency performance",
  },
  // Search concepts
  {
    title: "Semantic Search vs. Keyword Search",
    snippet:
      "Semantic search uses vector embeddings to understand intent. Keyword search uses BM25 or TF-IDF. Semantic search finds results even when exact words don't match.",
    text: "semantic search vector embedding keyword bm25 query retrieval similarity intent",
  },
  {
    title: "Building a Documentation Search Widget",
    snippet:
      "Integrate altor-vec into Docusaurus, Nextra, or GitBook. Embed the search widget with a script tag or React component. Pre-build the index at deploy time.",
    text: "documentation docs search widget react nextjs deploy index embed javascript npm",
  },
];

console.log(`Building index for ${DOCS.length} documents with ${DIMS} dimensions...`);

// Build flat vectors array
const flat = new Float32Array(DOCS.length * DIMS);
for (let i = 0; i < DOCS.length; i++) {
  const vec = textToVector(DOCS[i].text);
  flat.set(vec, i * DIMS);
}

// Build HNSW index
const engine = WasmSearchEngine.from_vectors(flat, DIMS, 16, 200, 50);
console.log(`Index built: ${engine.len()} vectors`);

// Serialize index
const indexBytes = engine.to_bytes();
writeFileSync("public/demo-index.bin", Buffer.from(indexBytes));
console.log(`Saved public/demo-index.bin (${indexBytes.byteLength} bytes)`);

// ---------------------------------------------------------------------------
// Pre-compute query embeddings for the demo queries
// ---------------------------------------------------------------------------
const DEMO_QUERIES = [
  {
    query: "how do I run search in a web worker?",
    text: "web worker javascript thread performance search worker",
  },
  {
    query: "what embedding models work with altor-vec?",
    text: "embedding model dimensions vector search float32array",
  },
  {
    query: "how do I handle authentication?",
    text: "oauth jwt token authentication authorization security",
  },
  {
    query: "how to optimize search performance?",
    text: "performance latency optimization wasm cache search benchmark",
  },
  {
    query: "how do I deploy to production?",
    text: "deploy vercel netlify cdn configuration server binary",
  },
];

const queryEmbeddings = DEMO_QUERIES.map(({ query, text }) => ({
  query,
  vector: Array.from(textToVector(text)),
}));

// Test the queries
console.log("\nQuery test results:");
for (const { query, vector } of queryEmbeddings) {
  const t0 = performance.now();
  const results = JSON.parse(
    engine.search(new Float32Array(vector), 3)
  );
  const ms = (performance.now() - t0).toFixed(3);
  console.log(`\n"${query}" (${ms}ms):`);
  for (const [id, dist] of results) {
    console.log(`  [${id}] ${DOCS[id].title} (dist=${dist.toFixed(4)})`);
  }
}

// Write TypeScript data file
const tsContent = `// Auto-generated by scripts/generate-demo-data.mjs — do not edit manually

export interface DemoDoc {
  title: string;
  snippet: string;
}

export interface DemoQuery {
  query: string;
  vector: number[];
}

export const DEMO_DOCS: DemoDoc[] = ${JSON.stringify(
  DOCS.map(({ title, snippet }) => ({ title, snippet })),
  null,
  2
)};

export const DEMO_QUERIES: DemoQuery[] = ${JSON.stringify(queryEmbeddings, null, 2)};
`;

writeFileSync("src/demo-data.ts", tsContent);
console.log("\nSaved src/demo-data.ts");

engine.free();
console.log("\nDone.");
