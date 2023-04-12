import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SSXNextAuth } from "@spruceid/ssx-authjs/server";
import { SSXServer } from "@spruceid/ssx-server";

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

export const authOptions: NextAuthOptions = {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      session,
    },
}

export default NextAuth(authOptions)

