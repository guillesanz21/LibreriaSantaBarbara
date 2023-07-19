import { Test, TestingModule } from '@nestjs/testing';
import { ImportExportController } from './import-export.books.controller';

describe('ImportExportController', () => {
  let controller: ImportExportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportExportController],
    }).compile();

    controller = module.get<ImportExportController>(ImportExportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
