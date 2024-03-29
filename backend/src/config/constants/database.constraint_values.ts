import { int4max } from './common_values';

export const userConstraints = {
  common: {
    email: {
      maxLength: 300,
    },
    address: {
      maxLength: 300,
    },
    phone_number: {
      maxLength: 15,
    },
    password: {
      minLength: 8,
      contains: '$2',
    },
    NIF: {
      maxLength: 15,
    },
  },
  customer: {
    first_name: {
      maxLength: 100,
    },
    last_name: {
      maxLength: 200,
    },
  },
  store: {
    name: {
      maxLength: 100,
    },
  },
};

export const bookConstraints = {
  ref: {
    min: 0,
  },
  title: {
    maxLength: 300,
  },
  author: {
    maxLength: 300,
  },
  publication_place: {
    maxLength: 100,
  },
  publisher: {
    maxLength: 100,
  },
  collection: {
    maxLength: 100,
  },
  year: {
    max: 2060,
  },
  size: {
    maxLength: 50,
  },
  weight: {
    min: 0,
  },
  pages: {
    min: 0,
    max: int4max, // 4 bytes. Careful if changing field type in database.
  },
  condition: {
    maxLength: 250,
  },
  description: {
    maxLength: 4000,
  },
  price: {
    min: 0,
    max: int4max, // 4 bytes. Careful if changing field type in database.
  },
  stock: {
    min: 0,
    max: int4max, // 4 bytes. Careful if changing field type in database.
  },
  binding: {
    maxLength: 75,
  },
  private_note: {
    maxLength: 4000,
  },
  keyword: {
    maxLength: 75,
  },
  topic: {
    maxLength: 75,
  },
  language: {
    length: 2,
  },
  location: {
    maxLength: 150,
  },
  status: {
    maxLength: 75,
  },
};
