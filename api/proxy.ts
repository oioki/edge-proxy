export const config = {
  runtime: 'edge',
}

export default async (req: Request) => {
  let pathname = new URL(req.url).pathname;

  // Fetch from the backend.
  const r = await fetch(
    process.env.UPSTREAM + pathname,
  )

  const nonce = crypto.randomUUID();
  const CSP_HEADER = 'content-security-policy-report-only';

  let csp = r.headers.get(CSP_HEADER) || '';
  if (!csp.includes('MAGICNONCE')) {
    // TODO: we should inject static nonce on the build phase
    csp = csp.replace(/script-src /, "script-src 'nonce-MAGICNONCE' ");
  }
  csp = csp.replace(/MAGICNONCE/g, nonce);

  let body = await r.text();
  if (!body.includes('MAGICNONCE')) {
    // TODO: we should inject static nonce on the build phase
    body = body.replace(/<script/g, "<script nonce=\"MAGICNONCE\"");
  }
  body = body.replace(/MAGICNONCE/g, nonce);

  return new Response(body, {
    status: r.status,
    headers: {
      // Allow list of backend headers.
      CSP_HEADER: csp,
      'content-type': r.headers.get('content-type') || '',
    },
  })
}
