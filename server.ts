import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");
const PROJECTS_FILE = path.join(process.cwd(), "content", "projects.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "emudpanelviral";

// Ensure content directory exists
if (!fs.existsSync(BLOGS_DIR)) {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });
}

if (!fs.existsSync(PROJECTS_FILE)) {
  const initialProjects = [
    {
      id: "1",
      title: "WAF Destroyer",
      description: "Advanced payload generator to bypass enterprise-grade Web Application Firewalls.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
      tech: ["Python", "Golang", "CyberSec"],
      category: "Security",
      repoUrl: "#"
    },
    {
      id: "2",
      title: "C-DDOS Module",
      description: "Distributed stress-testing module utilizing edge-node concurrency for high-pressure simulation.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      tech: ["C++", "Rust", "Networking"],
      category: "Destruction",
      liveUrl: "#"
    }
  ];
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2));
}

function new_date() {
  return new Date().toISOString().split('T')[0];
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- PROJECT API ---
  app.get("/api/projects", (req, res) => {
    try {
      const data = fs.readFileSync(PROJECTS_FILE, "utf8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Failed to load projects" });
    }
  });

  app.post("/api/admin/projects", (req, res) => {
    const { password, projects } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).send();
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    res.json({ success: true });
  });

  // --- API ROUTES ---

  // Get all blogs
  app.get("/api/blogs", (req, res) => {
    try {
      const files = fs.readdirSync(BLOGS_DIR);
      const blogs = files
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
        .map((filename) => {
          const content = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf8");
          const { data } = matter(content);
          return {
            slug: filename.replace(/\.mdx?$/, ""),
            ...data,
          };
        })
        .filter(b => b.published || req.query.admin === 'true')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ error: "Failed to load blogs" });
    }
  });

  // Get single blog
  app.get("/api/blogs/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const filePath = path.join(BLOGS_DIR, `${slug}.mdx`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Blog not found" });
      }
      const content = fs.readFileSync(filePath, "utf8");
      const { data, content: body } = matter(content);
      res.json({ slug, ...data, body });
    } catch (err) {
      res.status(500).json({ error: "Failed to load blog" });
    }
  });

  // Search API
  app.get("/api/search", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase();
    const files = fs.readdirSync(BLOGS_DIR);
    const blogs = files
      .map((filename) => {
        const content = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf8");
        const { data, content: body } = matter(content);
        return {
          slug: filename.replace(/\.mdx?$/, ""),
          ...data,
          body
        } as any;
      })
      .filter(b => b.published && (
        b.title?.toLowerCase().includes(query) || 
        b.description?.toLowerCase().includes(query) ||
        b.body?.toLowerCase().includes(query)
      ));
    res.json(blogs);
  });

  // Admin: Auth
  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });

  // Admin: Save Blog
  app.post("/api/admin/blogs", (req, res) => {
    const { password, slug, data, body } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).send();

    const fileName = slug.endsWith(".mdx") ? slug : `${slug}.mdx`;
    const content = matter.stringify(body, data);
    fs.writeFileSync(path.join(BLOGS_DIR, fileName), content);
    res.json({ success: true });
  });

  // Admin: Delete Blog
  app.delete("/api/admin/blogs/:slug", (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).send();

    const filePath = path.join(BLOGS_DIR, `${req.params.slug}.mdx`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
