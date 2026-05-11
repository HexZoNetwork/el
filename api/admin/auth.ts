import { VercelRequest, VercelResponse } from "@vercel/node";
import { checkRateLimit, recordFailure, resetRateLimit } from "../lib/rateLimit";

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0] : forwarded?.[0]) ||
    req.socket?.remoteAddress ||
    "unknown";
  return ip.trim();
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ip = getClientIP(req);
    // Tambahkan fallback empty object agar tidak crash saat destructuring
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || "emudpanelviral";

    // Check rate limit
    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        message: rateCheck.message,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // Verify password
    if (password && password === adminPassword) {
      // Reset rate limit on successful login
      await resetRateLimit(ip);
      return res.json({ success: true });
    } else {
      // Record failure
      await recordFailure(ip);
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (err) {
    console.error("Auth API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  }
}
