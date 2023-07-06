export const LoginJWTResponseSchema = {
  allOf: [
    {
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        },
        user: { $ref: '#/components/schemas/User' },
      },
    },
  ],
};
