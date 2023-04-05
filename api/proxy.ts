export const config = {
  runtime: 'edge',
}

export default async (req: Request) => {
  return new Response("api/proxy response", {status:200});
}
