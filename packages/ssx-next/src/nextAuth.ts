import CredentialsProvider from "next-auth/providers/credentials";


const ssxCredentialProviderOptions = {
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
              console.log("hoge");
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
              };
            } catch (e) {
              return null;
            }
          },
}

const SSXCredentialsProvider  =