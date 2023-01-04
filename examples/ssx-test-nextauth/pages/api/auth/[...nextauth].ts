import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SSXNextAuth } from "@spruceid/ssx-react/next-auth/backend";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const ssxConfig = {};
  const { credentials, authorize, session } = SSXNextAuth(req, res, ssxConfig);
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials,
      authorize,
    }),
  ];

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
     session,
    },
  });
}
