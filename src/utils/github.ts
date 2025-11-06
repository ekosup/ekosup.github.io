import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = import.meta.env.GITHUB_OWNER || "ekosup";
const GITHUB_REPO = import.meta.env.GITHUB_REPO || "ekosup.github.io";
const GITHUB_BRANCH = import.meta.env.GITHUB_BRANCH || "main";

export interface BlogPost {
  name: string;
  path: string;
  sha: string;
  content?: string;
}

/**
 * Initialize Octokit client
 */
function getOctokit(): Octokit {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return new Octokit({
    auth: GITHUB_TOKEN,
  });
}

/**
 * List all blog post files from the repository
 */
export async function listBlogPosts(): Promise<BlogPost[]> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: "src/content/blog",
      ref: GITHUB_BRANCH,
    });

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter(file => file.type === "file" && file.name.endsWith(".md"))
      .map(file => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
      }));
  } catch (error) {
    console.error("Error listing blog posts:", error);
    throw new Error("Failed to list blog posts from GitHub");
  }
}

/**
 * Get content of a specific blog post
 */
export async function getBlogPost(filename: string): Promise<BlogPost | null> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `src/content/blog/${filename}`,
      ref: GITHUB_BRANCH,
    });

    if (Array.isArray(data) || data.type !== "file") {
      return null;
    }

    // Decode base64 content
    const content = data.content
      ? Buffer.from(data.content, "base64").toString("utf-8")
      : "";

    return {
      name: data.name,
      path: data.path,
      sha: data.sha,
      content,
    };
  } catch (error) {
    console.error("Error getting blog post:", error);
    return null;
  }
}

/**
 * Update a blog post in the repository
 */
export async function updateBlogPost(
  filename: string,
  content: string,
  sha: string,
  commitMessage: string = "Update blog post via admin UI"
): Promise<boolean> {
  const octokit = getOctokit();

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `src/content/blog/${filename}`,
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      sha: sha,
      branch: GITHUB_BRANCH,
    });

    return true;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw new Error("Failed to update blog post on GitHub");
  }
}

/**
 * Create a new blog post in the repository
 */
export async function createBlogPost(
  filename: string,
  content: string,
  commitMessage: string = "Create new blog post via admin UI"
): Promise<boolean> {
  const octokit = getOctokit();

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `src/content/blog/${filename}`,
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      branch: GITHUB_BRANCH,
    });

    return true;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw new Error("Failed to create blog post on GitHub");
  }
}
