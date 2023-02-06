import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function linkWeb3Account(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (session) {
    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        web3Address: `did:pkh:eip155:${req.query.chainId}:${req.query.address}`
      },
    });
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
  res.end();
}