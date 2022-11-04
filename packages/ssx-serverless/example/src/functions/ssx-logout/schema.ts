export const signOutSchema = {
  type: "object",
  properties: {
    siwe: { type: 'string' },
    signature: { type: 'string' },
    daoLogin: { type: 'boolean' },
    address: { type: 'string' },
    // in the future we will add this property in order to enable custom indexers for sessions
    // sessionKey: { type: 'string' }
    walletAddress: { type: 'string' },
    chainId: { type: 'number' },
  },
  required: ['walletAddress']
} as const;
