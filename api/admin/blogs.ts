import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "emudpanelviral";
  const { password, slug, data, body } = req.body;

  if (password !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const blogsDir = path.join(process.cwd(), "content", "blogs");
    if (!fs.existsSync(blogsDir)) {
      fs.mkdirSync(blogsDir, { recursive: true });
    }

    const fileName = slug.endsWith(".mdx") ? slug : `${slug}.mdx`;
    const content = matter.stringify(body, data);
    fs.writeFileSync(path.join(blogsDir, fileName), content);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save blog" });
  }
}
