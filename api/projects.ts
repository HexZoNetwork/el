import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import fs from "fs";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const projectsFile = path.join(process.cwd(), "content", "projects.json");

    if (!fs.existsSync(projectsFile)) {
      const initialProjects = [
        {
          id: "1",
          title: "WAF Destroyer",
          description:
            "Advanced payload generator to bypass enterprise-grade Web Application Firewalls.",
          image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
          tech: ["Python", "Golang", "CyberSec"],
          category: "Security",
          repoUrl: "#",
        },
        {
          id: "2",
          title: "C-DDOS Module",
          description:
            "Distributed stress-testing module utilizing edge-node concurrency for high-pressure simulation.",
          image:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
          tech: ["C++", "Rust", "Networking"],
          category: "Destruction",
          liveUrl: "#",
        },
      ];
      return res.json(initialProjects);
    }

    const data = fs.readFileSync(projectsFile, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
}
