import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const blogsDir = path.join(process.cwd(), "content", "blogs");
    
    if (!fs.existsSync(blogsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(blogsDir);
    const blogs = files
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .map((filename) => {
        const content = fs.readFileSync(path.join(blogsDir, filename), "utf8");
        const { data } = matter(content);
        return {
          slug: filename.replace(/\.mdx?$/, ""),
          ...data,
        };
      })
      .filter((b) => b.published || req.query.admin === "true")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load blogs" });
  }
}
