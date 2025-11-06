import type { APIRoute } from "astro";
import { isAuthenticated } from "@utils/auth";
import { listBlogPosts } from "@utils/github";

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const posts = await listBlogPosts();
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch posts",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
