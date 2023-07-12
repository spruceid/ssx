import ssx from "../../../utils/_ssx";

export function GET() {
  const nonce = ssx.generateNonce();
  return new Response(nonce, {
    status: 200,
    headers: { 'Set-Cookie': `nonce=${nonce}` }
  });
}