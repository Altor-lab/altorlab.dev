import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawEmail = req.body?.email;
  const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const upstream = await fetch("https://lustlore.com/api/email/altorlab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Failed to subscribe" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Subscribe proxy error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
