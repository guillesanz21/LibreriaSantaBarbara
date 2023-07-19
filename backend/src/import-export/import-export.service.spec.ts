import { Test, TestingModule } from '@nestjs/testing';
import { ImportExportService } from './import-export.service';

describe('ImportExportService', () => {
  let service: ImportExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportExportService],
    }).compile();

    service = module.get<ImportExportService>(ImportExportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
