import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug } = req.query;
    const blogsDir = path.join(process.cwd(), "content", "blogs");
    const filePath = path.join(blogsDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const content = fs.readFileSync(filePath, "utf8");
    const { data, content: body } = matter(content);
    res.json({ slug, ...data, body });
  } catch (err) {
    res.status(500).json({ error: "Failed to load blog" });
  }
}
