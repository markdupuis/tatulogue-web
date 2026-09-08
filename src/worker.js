// Affiliate attribution landing route: /get/:code
//
// Android: log a click, then a real 302 redirect to Play Store with the
// referrer param embedded -- Google's Install Referrer API guarantees that
// string survives through install, so the app can read it back on first
// launch with no further work here.
//
// iOS: there is no install-referrer equivalent, so the fallback is a
// clipboard token the app reads on first launch. Clipboard writes require
// a user gesture in Safari, so this can't be a silent redirect -- it must
// render an interstitial with a real button tap.
//
// Everything else (desktop, unknown UA): a simple page with both store
// links, no auto-redirect.
//
// Falls through to static asset serving (env.ASSETS) for every other path.

const SUPABASE_URL = 'https://wvndcypeecniuzrnwnmx.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bmRjeXBlZWNuaXV6cm53bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDQ5NjcsImV4cCI6MjA3OTE4MDk2N30.ssbErAc6AMBL5UcZtd3q8YKRkFdS0qdfNmm7bcoHrUo';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tatulogue.app';
const APP_STORE_URL = 'https://apps.apple.com/us/app/tatulogue/id6794140876';

function detectPlatform(userAgent) {
  const ua = (userAgent || '').toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'web';
}

async function logClick(code, platform, userAgent) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/attribution_events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliate_code: code,
        event_type: 'click',
        platform,
        raw_payload: { user_agent: userAgent },
      }),
    });
  } catch (e) {
    // Never let a logging failure break the redirect -- the user still
    // needs to land on the store. An unknown/invalid code also lands here
    // (the DB has a foreign key from affiliate_code to affiliates.code),
    // which is fine: we just won't have a click row for it.
    console.error('attribution click log failed', e);
  }
}

function iosInterstitial(code) {
  const token = `TATU_REF:${code}:${Math.floor(Date.now() / 1000)}`;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Continue to Tatulogue</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#07070d; color:#fff; font-family:-apple-system,system-ui,sans-serif; }
  .card { text-align:center; padding:32px; }
  button { margin-top:20px; padding:14px 28px; font-size:17px; font-weight:600; color:#fff;
    background:linear-gradient(135deg,#F12711,#F5AF19); border:none; border-radius:999px; }
</style>
</head>
<body>
  <div class="card">
    <h1>Tatulogue</h1>
    <p>Tap below to continue to the App Store.</p>
    <button id="go">Continue to App Store</button>
  </div>
  <script>
    document.getElementById('go').addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(${JSON.stringify(token)});
      } catch (e) {
        console.error('clipboard write failed', e);
      }
      window.location.href = ${JSON.stringify(APP_STORE_URL)};
    });
  </script>
</body>
</html>`;
}

// Admin blog editor: POST /api/admin/blog/save { slug, content }
//
// Post bodies live as markdown files in content/blog/ in this repo (there's
// no database storage of post content), so "save" means committing the
// edited file straight to GitHub via its Contents API -- Cloudflare Pages'
// existing push-to-deploy picks it up from there, same as every other
// content change to this site. The GitHub token stays server-side; the
// client only ever holds its own Supabase session token.
const GITHUB_OWNER = 'markdupuis';
const GITHUB_REPO = 'tatulogue-web';
const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function verifyWebAdmin(authHeader) {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return false;

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

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

async function handleBlogSave(request, env) {
  const isAdmin = await verifyWebAdmin(request.headers.get('authorization'));
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Not authorized' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!env.GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN is not configured on this Worker' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { slug, content } = body || {};
  if (typeof slug !== 'string' || !BLOG_SLUG_PATTERN.test(slug)) {
    return new Response(JSON.stringify({ error: 'Invalid slug' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (typeof content !== 'string' || content.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Content cannot be empty' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const path = `content/blog/${slug}.md`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const ghHeaders = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'tatulogue-web-admin',
  };

  const getResp = await fetch(`${apiUrl}?ref=master`, { headers: ghHeaders });
  if (!getResp.ok) {
    return new Response(JSON.stringify({ error: `Post "${slug}" not found in the repo` }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
  const existing = await getResp.json();

  const putResp = await fetch(apiUrl, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `chore(blog): edit ${slug} via admin portal`,
      content: toBase64(content),
      sha: existing.sha,
      branch: 'master',
    }),
  });

  if (!putResp.ok) {
    const errText = await putResp.text();
    console.error('GitHub commit failed', putResp.status, errText);
    return new Response(JSON.stringify({ error: 'Failed to save to GitHub' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
}

function fallbackPage() {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Get Tatulogue</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#07070d; color:#fff; font-family:-apple-system,system-ui,sans-serif; }
  .card { text-align:center; padding:32px; }
  a { display:inline-block; margin:8px; padding:14px 28px; font-size:17px; font-weight:600; color:#fff;
    background:linear-gradient(135deg,#2B5876,#4E4376); border-radius:999px; text-decoration:none; }
</style>
</head>
<body>
  <div class="card">
    <h1>Tatulogue</h1>
    <p>Get the app:</p>
    <a href="${APP_STORE_URL}">App Store</a>
    <a href="${PLAY_STORE_URL}">Google Play</a>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/admin/blog/save' && request.method === 'POST') {
      return handleBlogSave(request, env);
    }

    const match = url.pathname.match(/^\/get\/([A-Za-z0-9_-]+)\/?$/);

    if (match) {
      const code = match[1];
      const userAgent = request.headers.get('user-agent') || '';
      const platform = detectPlatform(userAgent);

      await logClick(code, platform, userAgent);

      if (platform === 'android') {
        const ts = Math.floor(Date.now() / 1000);
        const referrer = encodeURIComponent(`affiliate_code=${code}&ts=${ts}`);
        return Response.redirect(`${PLAY_STORE_URL}&referrer=${referrer}`, 302);
      }

      if (platform === 'ios') {
        return new Response(iosInterstitial(code), {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        });
      }

      return new Response(fallbackPage(), {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
