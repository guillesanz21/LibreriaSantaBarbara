import { parse, unparse } from 'papaparse';
import { FileFormat, FileFormatEnum } from './FileFormat';

// TODO: Add xml parser. JSON is the vehicular format.
export const parser = (
  file: any,
  format_from: FileFormat,
  format_to?: FileFormat,
) => {
  if (format_from === format_to) {
    return file;
  }
  if (
    (format_from === FileFormatEnum.csv ||
      format_from === FileFormatEnum.tsv) &&
    format_to === FileFormatEnum.json
  ) {
    return csvToJson(file);
  }
  if (format_from === FileFormatEnum.json && format_to === FileFormatEnum.tsv) {
    return jsonToTsv(file);
  }
  if (format_from === FileFormatEnum.json && format_to === FileFormatEnum.csv) {
    return jsonToCsv(file);
  }
  return 'Not implemented yet';
};

const csvToJson = (file: string): any => {
  return parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
};

const jsonToTsv = (file: any): string => {
  return unparse(file, {
    delimiter: '\t',
    header: true,
  });
};

const jsonToCsv = (file: any): string => {
  return unparse(file, {
    delimiter: ',',
    header: true,
  });
};
