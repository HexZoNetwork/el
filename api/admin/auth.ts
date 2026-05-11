import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "emudpanelviral";

  if (password === adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
}
