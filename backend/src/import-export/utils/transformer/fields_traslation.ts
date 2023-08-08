export const UniliberToDBFields = {
  Referencia: 'ref',
  Título: 'title',
  Autor: 'author',
  Ilustrador: 'illustration', // Ignore
  Edición: 'edition', // Ignore
  Editorial: 'publisher',
  'Lugar de publicación': 'publication_place',
  'Año de publicación': 'year',
  ISBN: 'ISBN',
  Formato: 'size', // ???
  Encuadernación: 'binding',
  Peso: 'weight',
  Edición_1: 'edition_1', // Ignore
  Tirada: 'print_run', // Ignore
  Firmado: 'dedication', // Ignore
  Descripción: 'description',
  'Estado del libro': 'condition',
  'Estado de la cubierta': 'cover_condition', // Ignore
  Precio: 'price',
  'Tipo de artículo': 'kind_article', // Ignore
  Cantidad: 'stock',
  Catálogo: 'catalogue', // Ignore
  'Palabras clave': 'keywords',
  'Categoría de AbeBooks': 'AbeBooks_category', // Ignore
  'URL imagen': 'images',
};

// Inverse of UniliberToDBFields
export const DBToUniliberFields = Object.fromEntries(
  Object.entries(UniliberToDBFields).map(([key, value]) => [value, key]),
);

export const DBToESFields = {
  ref: 'Referencia',
  ISBN: 'ISBN',
  title: 'Título',
  author: 'Autor',
  publisher: 'Editorial',
  publication_place: 'Lugar de publicación',
  year: 'Año de publicación',
  collection: 'colección',
  size: 'Tamaño',
  weight: 'Peso',
  pages: 'Número de páginas',
  condition: 'Estado del libro',
  description: 'Descripción',
  price: 'Precio',
  stock: 'Cantidad',
  binding: 'Encuadernación',
  languages: 'Idiomas',
  topics: 'Materias',
  keywords: 'Palabras clave',
  images: 'Imágenes',
  // Don't export:
  // id, store_id, private_note, created_at, updated_at, sold_at, deleted_at, status, location
};

export const ESToDBFields = Object.fromEntries(
  Object.entries(DBToESFields).map(([key, value]) => [value, key]),
);
