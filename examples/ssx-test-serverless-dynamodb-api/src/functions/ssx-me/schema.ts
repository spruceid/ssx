export const getMeSchema = {
  type: "object",
  properties: {
    address: { type: 'string' },
  },
  required: ['address']
} as const;