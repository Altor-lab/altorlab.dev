export type DemoQuery = {
  query: string;
  vector?: number[];
};

export const DEMO_QUERIES: DemoQuery[] = [
  { query: "semantic search for product docs" },
  { query: "find pricing page refund policy" },
  { query: "browser-based RAG example" },
  { query: "autocomplete for ecommerce catalog" },
  { query: "offline vector search in JavaScript" },
];
