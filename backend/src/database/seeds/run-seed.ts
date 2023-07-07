import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { UserTypeSeedService } from './user-type/user-type-seed.service';
import { UserSeedService } from './user/user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(UserTypeSeedService).run();
  // Only for development and test
  if (process.env.NODE_ENV !== 'production') {
    await app.get(UserSeedService).run();
  }

  await app.close();
};

void runSeed();
