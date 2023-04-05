import type { RequestContext } from '@vercel/edge';

// https://vercel.com/docs/concepts/functions/edge-middleware/middleware-api#waituntil
 
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
 
async function getAlbum() {
  const res = await fetch('https://dev.oioki.me/origin/test.json');
  await wait(10000);
  return res.json();
}
 
export default function middleware(request: Request, context: RequestContext) {
  context.waitUntil(getAlbum().then((json) => console.log({ json })));
 
  return new Response('{"hello": "world"}', {
    status: 200
  });
}

