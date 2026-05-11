import { VercelRequest, VercelResponse } from "@vercel/node";

interface Database {
  blogs: any[];
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
    const db = await getDBFromGithub();
    res.json(db.projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
}
