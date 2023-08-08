import { DBToESFields, DBToUniliberFields } from './fields_traslation';
import { Book } from 'src/books/books/entities/book.entity';
import { UniliberType } from './fields.types';
import { ImportExport } from './ImportExportFormat';
import { CSV_DefaultESPlaceholder } from './schemas/DefaultES';
import { StatusEnum } from 'src/books/status/status.types';

export const booksTransformer = (
  data: any[],
  format_from: ImportExport,
  format_to: ImportExport,
  keywords_to_topics?: boolean,
  clean_description?: boolean,
): any => {
  if (format_from === 'uniliber' && format_to === 'db') {
    return transfromUniliber2DB(data, keywords_to_topics, clean_description);
  }
  if (format_from === 'db' && format_to === 'es') {
    return transformDB2ES(data);
  }
  return 'Not implemented';
};

// TODO: I'm not happy with this implementation. Review and improve. Test. This is messy.
const transfromUniliber2DB = (
  books: UniliberType[],
  keywords_to_topics?: boolean,
  clean_description?: boolean,
): any => {
  return books.map((book) => {
    const newBook = {};
    for (const field in DBToESFields) {
      newBook[field] = book[DBToESFields[field]] || null;
      if (field === 'images' && book[DBToUniliberFields.images]) {
        newBook[field] = Array(book[DBToUniliberFields.images]);
      } else if (field === 'keywords' && book[DBToUniliberFields.keywords]) {
        newBook[field] = book[DBToUniliberFields.keywords]
          .split(',')
          .map((keyword: string) => keyword.trim());
      } else if (field === 'topics') {
        if (book[DBToUniliberFields.topics]) {
          newBook[field] = book[DBToUniliberFields.topics]
            .split(',')
            .map((topic: string) => topic.trim());
        } else if (keywords_to_topics && book[DBToUniliberFields.keywords]) {
          newBook[field] = newBook[field] = book[DBToUniliberFields.keywords]
            .split(',')
            .map((keyword: string) => keyword.trim());
        }
      } else if (field === 'description' && clean_description) {
        // Delete "<p>" and "</p>" from the description
        newBook[field] = book[DBToUniliberFields.description]
          ? String(book[DBToUniliberFields.description])
              .replace(/<p>/g, '')
              .replace(/<\/p>/g, '')
          : null;
      }
    }
    return newBook;
  });
};

const transformDB2ES = (books: Book[]) => {
  const id_fields = ['id', 'store_id', 'location_id', 'status_id'];
  const private_fields = [
    'private_note',
    'location',
    'created_at',
    'updated_at',
    'deleted_at',
    'sold_at',
  ];
  return books.map((book: Book) => {
    const transformedBook = Object.assign({}, CSV_DefaultESPlaceholder);
    for (const field in book) {
      // Ignore fields
      if (id_fields.includes(field) || private_fields.includes(field)) {
        continue;
      }
      // Format fields
      else if (field === 'keywords') {
        transformedBook[DBToESFields[field]] = book[field]
          .map(({ keyword }) => {
            return keyword.trim();
          })
          .join(', ');
      } else if (field === 'topics') {
        transformedBook[DBToESFields[field]] = book[field]
          .map(({ topic }) => {
            return topic.trim();
          })
          .join(', ');
      }
      // Split fields
      else if (field === 'images') {
        if (book[field] && book[field].length > 0) {
          transformedBook['Imagen 1 (Principal)'] = book[field][0].url;
        }
        if (book[field] && book[field].length > 1) {
          transformedBook['Imagen 2'] = book[field][1].url;
        }
        if (book[field] && book[field].length > 2) {
          transformedBook['Imagen 3'] = book[field][2].url;
        }
      } else if (field === 'languages') {
        if (book[field] && book[field].length > 0) {
          transformedBook['Idioma 1'] = book[field][0].language;
        }
        if (book[field] && book[field].length > 1) {
          transformedBook['Idioma 2'] = book[field][1].language;
        }
      }
      // New field from other fields
      else if (field === 'status') {
        transformedBook['vendido'] =
          !!book['sold_at'] && book[field].id === StatusEnum.sold;
        continue;
      }
      // Copy fields
      else {
        transformedBook[DBToESFields[field]] = book[field];
      }
    }
    return transformedBook;
  });
};
