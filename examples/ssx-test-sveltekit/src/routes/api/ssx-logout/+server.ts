import { json } from "@sveltejs/kit";
import ssx from "../../../utils/_ssx";

export async function POST() {
  return json(
    {
      success: await ssx.logout() ?? true
    },
    {
      status: 200
    }
  );
}