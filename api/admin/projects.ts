import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "emudpanelviral";
  const { password, projects } = req.body;

  if (password !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const projectsFile = path.join(process.cwd(), "content", "projects.json");
    const contentDir = path.dirname(projectsFile);

    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save projects" });
  }
}
