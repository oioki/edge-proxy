export const config = {
  runtime: 'edge',
}

export default async (req: Request) => {
  console.log('url', req.url);
  console.log('query', req.query);
  console.log('headers', req.headers);

  // Fetch from the backend.
  const r = await fetch(
    'https://dev.oioki.me/origin/',
  )

  crypto = require('crypto');

  const nonce = crypto.randomBytes(16).toString("hex");

  csp = r.headers.get('content-security-policy') || '';
  csp = csp.replaceAll('MAGIC_NONCE', nonce);

  body = r.body.replaceAll('MAGIC_NONCE', nonce);

  return new Response(r.body, {
    status: r.status,
    headers: {
      // Allow list of backend headers.
      'content-security-policy': csp,
      'content-type': r.headers.get('content-type') || '',
    },
  })
}

function getCookies(req: Request) {
  const cookie = req.headers.get('cookie')
  const cookies = new Map()
  if (!cookie) {
    return cookies
  }
  const pairs = cookie.split(/;\s+/)
  for (const pair of pairs) {
    const parts = pair.trim().split('=')
    cookies.set(parts[0], parts[1])
  }
  return cookies
}
