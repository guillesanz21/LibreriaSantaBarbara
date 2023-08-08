import { chmod, writeFile } from 'fs/promises';
import * as fs from 'fs';
import { ExtensionFormat, ExtensionFormatEnum } from './ExtensionFormat';

type DataType = 'books' | 'users';
export enum DataTypeEnum {
  books = 'books',
  users = 'users',
}
const dirPath = `src/tmp`;
const permissions = 0o766;

export const importFile = async (fileName: string) => {
  const filePath = `${dirPath}/${fileName}`;
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist`);
  }
  const data = fs.readFileSync(filePath, { encoding: 'latin1' });
  return data;
};

export const exportFile = async (
  data: any,
  dataType: DataType,
  file_name: string,
  fileExtension: ExtensionFormat,
) => {
  const fileName = `${Date.now()}.${file_name}.${dataType}.${fileExtension}`;
  const filePath = `${dirPath}/exported/${fileName}`;
  try {
    let dataToWrite = data;
    if (fileExtension === ExtensionFormatEnum.json) {
      dataToWrite = JSON.stringify(data);
    }
    await writeFile(filePath, dataToWrite, { encoding: 'binary' });
    await chmod(filePath, permissions);
  } catch (error) {
    throw new Error(`Error writing file ${fileName}`);
  }
};
