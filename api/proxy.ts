export const config = {
  runtime: 'edge',
}

export default async (req: Request) => {
  console.log('url.pathname', req.url.pathname);
  console.log('env', process.env);

  // Fetch from the backend.
  const r = await fetch(
    process.env.UPSTREAM + '/',
  )

  const nonce = crypto.randomUUID();

  let csp = r.headers.get('content-security-policy') || '';
  csp = csp.replace(/MAGIC_NONCE/g, nonce);

  let body = await r.text();
  body = body.replace(/MAGIC_NONCE/g, nonce);

  return new Response(body, {
    status: r.status,
    headers: {
      // Allow list of backend headers.
      'content-security-policy': csp,
      'content-type': r.headers.get('content-type') || '',
    },
  })
}
