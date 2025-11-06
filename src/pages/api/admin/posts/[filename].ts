import type { APIRoute } from "astro";
import { isAuthenticated } from "@utils/auth";
import { getBlogPost, updateBlogPost } from "@utils/github";

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { filename } = params;

  if (!filename) {
    return new Response(
      JSON.stringify({ error: "Filename is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const post = await getBlogPost(filename);

    if (!post) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch post",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Check authentication
  if (!isAuthenticated(cookies)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { filename } = params;

  if (!filename) {
    return new Response(
      JSON.stringify({ error: "Filename is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { content, sha, commitMessage } = body;

    if (!content || !sha) {
      return new Response(
        JSON.stringify({ error: "Content and SHA are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await updateBlogPost(
      filename,
      content,
      sha,
      commitMessage || `Update ${filename} via admin UI`
    );

    return new Response(
      JSON.stringify({ success: true, message: "Post updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update post",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
