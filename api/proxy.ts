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

  let csp = r.headers.get('content-security-policy-report-only') || '';
  csp = csp.replace(/STATICNONCE/g, nonce);

  let body = await r.text();
  body = body.replace(/STATICNONCE/g, nonce);

  return new Response(body, {
    status: r.status,
    headers: {
      // Allow list of backend headers.
      'content-security-policy-report-only': csp,
      'content-type': r.headers.get('content-type') || '',
    },
  })
}
