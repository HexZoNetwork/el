import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "emudpanelviral";
  const { password } = req.body;
  const { slug } = req.query;

  if (password !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const blogsDir = path.join(process.cwd(), "content", "blogs");
    const filePath = path.join(blogsDir, `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
}
