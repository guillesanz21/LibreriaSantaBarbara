export const BookResponseSchema = {
  allOf: [
    { $ref: '#/components/schemas/Book' },
    {
      properties: {
        languages: {
          type: 'array',
          items: { $ref: '#/components/schemas/Language' },
        },
      },
    },
    {
      properties: {
        keywords: {
          type: 'array',
          items: { $ref: '#/components/schemas/Keyword' },
        },
      },
    },
    {
      properties: {
        topics: {
          type: 'array',
          items: { $ref: '#/components/schemas/Topic' },
        },
      },
    },
    {
      properties: {
        images: {
          type: 'array',
          items: { $ref: '#/components/schemas/Image' },
        },
      },
    },
    {
      properties: {
        location: { $ref: '#/components/schemas/Location' },
      },
    },
    {
      properties: {
        status: { $ref: '#/components/schemas/Status' },
      },
    },
  ],
};
