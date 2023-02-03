import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SSXServer } from "@spruceid/ssx-server";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"
import { SSXNextAuthWithEmail } from "../../../components/SSXNextAuthWithEmailBackend";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const ssxConfig = {};
  const ssx = new SSXServer(ssxConfig);
  const { credentials, authorize, session } = SSXNextAuthWithEmail(req, res, ssx);
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials,
      authorize,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ];

  return await NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      session
    }
  });
}