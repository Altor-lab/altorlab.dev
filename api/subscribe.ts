import type { VercelRequest, VercelResponse } from "@vercel/node";

type ResendErrorResponse = {
  error?: {
    message?: string;
  };
  message?: string;
};

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as ResendErrorResponse;
    return payload.error?.message ?? payload.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawEmail = req.body?.email;
  const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY env var");
    return res.status(500).json({ error: "Email service unavailable" });
  }

  try {
    if (audienceId) {
      const audienceRes = await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          audience_id: audienceId,
          unsubscribed: false,
        }),
      });

      if (!audienceRes.ok && audienceRes.status !== 409) {
        const errorMessage = await readErrorMessage(audienceRes);
        console.error("Resend contact error:", errorMessage);
        return res.status(502).json({ error: "Failed to save subscriber" });
      }
    }

    const welcomeRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Anshul from altor-vec <hi@altorlab.com>",
        to: [email],
        subject: "Welcome to altor-vec updates",
        html: "<p>Thanks for signing up! We'll keep you posted on new features, tutorials, and releases for <a href=\"https://altorlab.dev\">altor-vec</a>.</p><p>— Anshul, AltorLab</p>",
      }),
    });

    if (!welcomeRes.ok) {
      const errorMessage = await readErrorMessage(welcomeRes);
      console.error("Resend welcome email error:", errorMessage);
      return res.status(502).json({ error: "Failed to send welcome email" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
