import ssx from "../_ssx";

export async function GET(request: Request) {
  const nonce = ssx.generateNonce();
  return new Response(nonce, {
    status: 200,
    headers: { 'Set-Cookie': `nonce=${nonce}` }
  });
}