import { chmod, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { ExtensionFormat } from './ExtensionFormat';

type DataType = 'books' | 'users';
const dirPath = `src/tmp`;
const permissions = 0o766;

export const importFile = async (fileName: string) => {
  const filePath = `${dirPath}/${fileName}`;
  if (!existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist`);
  }
  const data = await readFile(filePath, { encoding: 'binary' });
  return data;
};

export const exportFile = async (
  data: any,
  dataType: DataType,
  fileExtension: ExtensionFormat,
) => {
  const fileName = `${Date.now()}.${dataType}.${fileExtension}`;
  const filePath = `${dirPath}/exported/${fileName}`;
  try {
    await writeFile(filePath, data, { encoding: 'binary' });
    await chmod(filePath, permissions);
  } catch (error) {
    throw new Error(`Error writing file ${fileName}`);
  }
};
