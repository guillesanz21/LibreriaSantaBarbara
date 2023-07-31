import { DBToESFields, DBToUniliberFields } from './fields_traslation';
import { UniliberType } from './fields.types';
import { ImportExport } from './ImportExportFormat';

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
    return transformDB2ES(data, keywords_to_topics);
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
      }
      if (field === 'keywords' && book[DBToUniliberFields.keywords]) {
        newBook[field] = book[DBToUniliberFields.keywords]
          .split(',')
          .map((keyword: string) => keyword.trim());
      }
      if (field === 'topics') {
        if (book[DBToUniliberFields.topics]) {
          newBook[field] = book[DBToUniliberFields.topics]
            .split(',')
            .map((topic: string) => topic.trim());
        } else if (keywords_to_topics && book[DBToUniliberFields.keywords]) {
          newBook[field] = newBook[field] = book[DBToUniliberFields.keywords]
            .split(',')
            .map((keyword: string) => keyword.trim());
        }
      }
      if (field === 'description' && clean_description) {
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

const transformDB2ES = (books, keywords_to_topics?: boolean) => {
  return 'Todo';
};
