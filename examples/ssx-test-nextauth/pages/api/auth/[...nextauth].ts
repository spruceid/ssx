import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage, SSXServer } from "@spruceid/ssx-server";

const ssxConfig = {};
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: "Exxthereum",
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
        daoLogin: {
          label: "daoLogin",
          type: "boolean",
          placeholder: "false",
        },
        resolveEns: {
          label: "resolveEns",
          type: "boolean",
          placeholder: "false",
        },
      },
      async authorize(credentials) {
        try {
          console.log("authorize");
          console.log(credentials)

          const ssx = new SSXServer(ssxConfig);
          const nonce = await getCsrfToken({ req });

          // validate signature, nonce and ssx config options
          const { success, error, session } = await ssx.login(
            credentials?.message || "",
            credentials?.signature || "",
            JSON.parse(credentials?.daoLogin || "false"),
            JSON.parse(credentials?.resolveEns || "false"),
            nonce || "",
          );
         const { siwe, signature, daoLogin, ens } = session;
         if(!siwe) return null;

        //  // check domain 
        //  const nextAuthUrl = new URL(process.env.DOMAIN as string);
        //  if (siwe.domain !== nextAuthUrl.host) {
        //     return null;
        //  }
  
        console.log("success: ", success);
        if (success) {
          return {
            id: `did:pkh:eip155:${siwe.chainId}:${siwe.address}`,
            name: ens?.domain || siwe.address,
            image: ens?.avatarUrl,
            address: siwe.address,
            test: "woo",
          };
        }
        } catch (e) {
          console.log(e);
          return null;
        }
        return null;
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
        console.log("session");
        console.log(sessionData);
        const { session, user, token } = sessionData;
        console.log(user)
        // session.address = token.sub;
        if (session.user) {
          session.user.name = token.sub;
        }
        // session.ssx = "ssx";
        // session.userId =`did:pkh:eip155:${siwe.chainId}:${siwe.address}`;

        return session;
      },
    },
  });
}
