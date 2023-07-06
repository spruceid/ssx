"use client";
import { SSX } from "@spruceid/ssx";
import { useState } from "react";
import Button from "./Button";
import AccountInfo from "./AccountInfo";

const SSXComponent = () => {

  const [ssxProvider, setSSX] = useState<SSX | null>(null);

  const ssxHandler = async () => {
    const ssx = new SSX({
      providers: {
        server: {
          host: "http://localhost:3000/api"
        }
      },
    });
    await ssx.signIn();
    setSSX(ssx);
  };

  const ssxLogoutHandler = async () => {
    ssxProvider?.signOut();
    setSSX(null);
  };

  const address = ssxProvider?.address() || '';

  return (
    <>
      {
        ssxProvider ?
          <>
            <Button onClick={ssxLogoutHandler}>
              SIGN-OUT
            </Button>
            <AccountInfo
              address={ssxProvider?.address()}
              session={ssxProvider?.session()}
            />
          </> :
          <Button onClick={ssxHandler}>
            SIGN-IN WITH ETHEREUM
          </Button>
      }
    </>
  );
};

export default SSXComponent;