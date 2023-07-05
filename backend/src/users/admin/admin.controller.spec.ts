import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
