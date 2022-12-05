import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          console.log("authorize");
          console.log(credentials)
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const nextAuthUrl = new URL(process.env.DOMAIN as string);
          if (siwe.domain !== nextAuthUrl.host) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(credentials?.signature || "");
          return {
            id: siwe.address,
            name: siwe.address,
            address: siwe.address,

          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      async session(sessionData) {
        console.log(sessionData);
        const { session, token } = sessionData;
        session.address = token.sub;
        if (session.user) {
          session.user.name = token.sub;
        }
        session.ssx = "ssx";
        return session;
      },
    },
  });
}
