import type { RequestContext } from '@vercel/edge';

// https://vercel.com/docs/concepts/functions/edge-middleware/middleware-api#waituntil
 
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
 
export async function middleware(request: Request, context: RequestContext) {
  console.log('url', request.url);
  console.log('query', request.query);

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

