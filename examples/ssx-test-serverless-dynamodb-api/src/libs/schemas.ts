const signInOutProperties = {
    siwe: { type: 'string' },
    signature: { type: 'string' },
    daoLogin: { type: 'boolean' },
    address: { type: 'string' },
    // in the future we will add this property in order to enable custom indexers for sessions
    // sessionKey: { type: 'string' }
    walletAddress: { type: 'string' },
    chainId: { type: 'number' },
};

export const signInSchema = {
    type: "object",
    properties: signInOutProperties,
    required: ['siwe', 'signature', 'address', 'walletAddress']
} as const;

export const signOutSchema = {
    type: "object",
    properties: signInOutProperties,
    required: ['walletAddress']
} as const;

export const requireAddressSchema = {
    type: "object",
    properties: {
        address: { type: 'string' },
    },
    required: ['address']
} as const;