export const getMeSchema = {
  type: "object",
  properties: {
    address: { type: 'string' },
    uuid: { type: 'string' }
  },
  required: ['address', 'uuid']
} as const;