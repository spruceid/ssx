import { json } from "@sveltejs/kit";
import ssx from "../../../utils/_ssx";

export async function POST({ request, cookies }) {
  const body = await request.json();

  const nonce = cookies.get('nonce');

  return json(
    await ssx.login(
      body.siwe,
      body.signature,
      body.daoLogin,
      body.resolveEns,
      nonce ?? "",
      body.resolveLens,
    ),
    {
      status: 200
    }
  );
}