import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

interface Database {
  blogs: any[];
  projects: any[];
}

async function getDBFromGithub(): Promise<Database> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) {
    return getDBLocal();
  }

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

    return getDBLocal();
  } catch (err) {
    console.error("Failed to fetch from GitHub:", err);
    return getDBLocal();
  }
}

function getDBLocal(): Database {
  try {
    const dbPath = path.join(process.cwd(), "db.json");
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read local db.json:", err);
  }
  return { blogs: [], projects: [] };
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
