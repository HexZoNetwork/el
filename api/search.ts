import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const query = (req.query.q as string || "").toLowerCase();
    const blogsDir = path.join(process.cwd(), "content", "blogs");

    if (!fs.existsSync(blogsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(blogsDir);
    const blogs = files
      .map((filename) => {
        const content = fs.readFileSync(path.join(blogsDir, filename), "utf8");
        const { data, content: body } = matter(content);
        return {
          slug: filename.replace(/\.mdx?$/, ""),
          ...data,
          body,
        } as any;
      })
      .filter(
        (b) =>
          b.published &&
          (b.title?.toLowerCase().includes(query) ||
            b.description?.toLowerCase().includes(query) ||
            b.body?.toLowerCase().includes(query))
      );

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to search blogs" });
  }
}
