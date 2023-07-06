export const UserResponseSchema = {
  $ref: '#/components/schemas/User',
};

export const CustomerResponseSchema = {
  allOf: [
    { $ref: '#/components/schemas/User' },
    { $ref: '#/components/schemas/Customer' },
  ],
};

export const StoreResponseSchema = {
  allOf: [
    { $ref: '#/components/schemas/User' },
    { $ref: '#/components/schemas/Store' },
  ],
};
