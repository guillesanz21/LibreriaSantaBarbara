import { Test, TestingModule } from '@nestjs/testing';
import { ForgotService } from './forgot.service';

describe('ForgotService', () => {
  let service: ForgotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotService],
    }).compile();

    service = module.get<ForgotService>(ForgotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
