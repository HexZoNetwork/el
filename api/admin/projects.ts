import { VercelRequest, VercelResponse } from "@vercel/node";

interface Database {
  blogs: any[];
  projects: any[];
}

async function getDBFromGithub(): Promise<{ data: Database; sha: string }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "your-username/your-repo";

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/db.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch db.json from GitHub");
  }

  const json = await res.json() as any;
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(content), sha: json.sha };
}

async function updateDBOnGithub(
  data: Database,
  sha: string,
  message: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "your-username/your-repo";

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/db.json`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content,
        sha,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update db.json on GitHub");
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "emudpanelviral";
  const { password, projects } = req.body;

  if (password !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { data: dbData, sha } = await getDBFromGithub();
    dbData.projects = projects;
    await updateDBOnGithub(dbData, sha, "Update projects");
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save projects" });
  }
}
