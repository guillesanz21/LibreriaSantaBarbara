import { Test, TestingModule } from '@nestjs/testing';
import { JWTService } from './jwt.service';

describe('JWTService', () => {
  let service: JWTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JWTService],
    }).compile();

    service = module.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
