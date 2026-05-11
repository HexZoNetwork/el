import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

interface Database {
  blogs: any[];
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
  return JSON.parse(content);
}

function writeDB(db: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

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
    const db = readDB();
    const blogIndex = db.blogs.findIndex((b) => b.slug === slug);
    
    const newBlog = {
      slug,
      ...data,
      body,
    };

    if (blogIndex >= 0) {
      db.blogs[blogIndex] = newBlog;
    } else {
      db.blogs.push(newBlog);
    }

    writeDB(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save blog" });
  }
}
