import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

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

const DB_PATH = path.join(process.cwd(), "db.json");

function readDB(): Database {
  if (!fs.existsSync(DB_PATH)) {
    const defaultDB: Database = { blogs: [], projects: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
    return defaultDB;
  }
  const content = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(content) as Database;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const query = (req.query.q as string || "").toLowerCase();
    const db = readDB();
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
