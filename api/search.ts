import { VercelRequest, VercelResponse } from "@vercel/node";

interface Blog {
  slug: string;
  title: string;
  description: string;
  date: string;
  published?: boolean;
  author?: string;
  body: string;
  [key: string]: any;
}

interface Database {
  blogs: Blog[];
  projects: any[];
}

async function getDBFromGithub(): Promise<Database> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "your-username/your-repo";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/db.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );

    if (res.ok) {
      const content = await res.text();
      return JSON.parse(content);
    }

    return { blogs: [], projects: [] };
  } catch (err) {
    console.error("Failed to fetch from GitHub:", err);
    return { blogs: [], projects: [] };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const query = (req.query.q as string || "").toLowerCase();
    const db = await getDBFromGithub();
    const blogs: Blog[] = db.blogs.filter(
      (b: Blog) =>
        b.published !== false &&
        (b.title?.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.body?.toLowerCase().includes(query))
    );

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to search blogs" });
  }
}
