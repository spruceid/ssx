import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SSXNextAuth } from "@spruceid/ssx-authjs/server";
import { SSXServer } from "@spruceid/ssx-server";

export const getAuthOptions = (): AuthOptions => {
  const ssxConfig = {};
  const ssx = new SSXServer(ssxConfig);
  const { credentials, authorize, session } = SSXNextAuth(ssx);
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials,
      authorize,
    }),
  ];

  return {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      session,
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const options = await getAuthOptions();
  return await NextAuth(options);
}
