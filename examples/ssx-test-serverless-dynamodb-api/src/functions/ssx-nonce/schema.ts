export const getNonceSchema = {
  type: "object",
  properties: {
    address: { type: 'string' }
  },
  required: ['address']
} as const;