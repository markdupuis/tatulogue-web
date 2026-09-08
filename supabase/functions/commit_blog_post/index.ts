import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Admin blog editor save: commits an edited post's markdown straight to
// the tatulogue-web repo via GitHub's Contents API. Reuses the GITHUB_TOKEN
// secret already configured on this Supabase project for sync-to-github
// (Supabase secrets are project-wide, not per-function) -- no new
// credential needed. Cloudflare's existing push-to-deploy picks up the
// commit like any other content change to the site.

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN")!;
const GITHUB_OWNER = "markdupuis";
const GITHUB_REPO = "tatulogue-web";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function isWebAdmin(token: string): Promise<boolean> {
  const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!userResp.ok) return false;
  const user = await userResp.json();
  if (!user?.id) return false;

  const adminResp = await fetch(
    `${SUPABASE_URL}/rest/v1/web_admins?user_id=eq.${user.id}&select=id`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` } }
  );
  if (!adminResp.ok) return false;
  const rows = await adminResp.json();
  return Array.isArray(rows) && rows.length > 0;
}

function toBase64(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token || !(await isWebAdmin(token))) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { slug?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { slug, content } = body;
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    return new Response(JSON.stringify({ error: "Invalid slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (typeof content !== "string" || content.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Content cannot be empty" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const path = `content/blog/${slug}.md`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const ghHeaders = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "tatulogue-admin-blog-editor",
  };

  const getResp = await fetch(`${apiUrl}?ref=master`, { headers: ghHeaders });
  if (!getResp.ok) {
    return new Response(JSON.stringify({ error: `Post "${slug}" not found in the repo` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const existing = await getResp.json();

  const putResp = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...ghHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `chore(blog): edit ${slug} via admin portal`,
      content: toBase64(content),
      sha: existing.sha,
      branch: "master",
    }),
  });

  if (!putResp.ok) {
    const errText = await putResp.text();
    console.error("[commit_blog_post] GitHub commit failed", putResp.status, errText);
    return new Response(JSON.stringify({ error: "Failed to save to GitHub" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
