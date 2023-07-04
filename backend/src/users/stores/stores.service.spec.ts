import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareHashedPassword } from 'src/utils/hash-password';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

const testUser1 = {
  id: 2,
  user_type_id: 2,
  role_id: 2,
  email: 'test1@test.com',
  password: 'testpassword',
  NIF: '123456789A',
  address: null,
  phone_number: '123456789',
  hash: null,
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};
const testStore1 = {
  user_id: testUser1.id,
  approved: false,
  name: 'Test Store 1',
  last_activity: testUser1.created_at,
  updated_at: testUser1.updated_at,
  user: testUser1,
};

const testUser2 = {
  id: 3,
  user_type_id: 2,
  role_id: 2,
  email: 'test2@test.com',
  password: 'testpassword',
  NIF: '123456789B',
  address: null,
  phone_number: '123456780',
  hash: null,
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};
const testStore2 = {
  user_id: testUser2.id,
  approved: true,
  name: 'Test Store 2',
  last_activity: testUser2.created_at,
  updated_at: testUser2.updated_at,
  user: testUser2,
};

const testStoresArray = [
  { id: 1, ...testStore1 },
  { id: 2, ...testStore2 },
];

const pepper = 'test-pepper';

describe('StoresService', () => {
  let service: StoresService;
  let userRepo: Repository<User>;
  let storeRepo: Repository<Store>;
  let configService: ConfigService;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation((UserDto: CreateUserDto) => UserDto),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    restore: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const mockStoresRepository = {
    find: jest.fn().mockResolvedValue(testStoresArray),
    findOne: jest.fn().mockImplementation((fields) => {
      return { id: fields.where.id, ...testStore1 };
    }),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(testStore1),
    }),
    create: jest
      .fn()
      .mockImplementation((storeDTO: CreateStoreDto) => storeDTO),
    save: jest.fn().mockImplementation((store: CreateStoreDto) =>
      Promise.resolve({
        id: Date.now(),
        user_id: Date.now() + 1,
        approved: false,
        user: {
          id: Date.now() + 1,
          user_type_id: 2,
          role_id: store.role_id,
          email: store.email,
          password: store.password,
          NIF: store.NIF,
          address: store.address,
          phone_number: store.phone_number,
          hash: null,
          last_activity: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString().split('T')[0],
          updated_at: null,
          deleted_at: null,
        },
        name: store.name,
        updated_at: null,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoresRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(pepper),
          },
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    storeRepo = module.get<Repository<Store>>(getRepositoryToken(Store));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepo).toBeDefined();
    expect(storeRepo).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should return an array of stores', async () => {
    const stores = await service.findMany({});
    expect(stores).toEqual(testStoresArray);
  });

  it('should return an array of stores with pagination', async () => {
    const stores = await service.findManyWithPagination(
      {},
      { page: 1, limit: 10 },
    );
    expect(stores).toEqual(testStoresArray);
  });

  it('should return a single store', async () => {
    const store = await service.findOne({ id: 1 });
    expect(store).toEqual({ id: 1, ...testStore1 });
  });

  it('should create a store with hashed password', async () => {
    const storeToCreate = {
      role_id: testUser1.role_id,
      email: testUser1.email,
      password: testUser1.password,
      name: testStore1.name,
      NIF: testUser1.NIF,
      address: testUser1.address,
      phone_number: testUser1.phone_number,
    };
    const createdStore = await service.create(storeToCreate);

    const isPasswordCorrectlyHashed = await compareHashedPassword(
      testUser1.password,
      createdStore.user.password,
      pepper,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);

    expect(createdStore).toEqual({
      user: {
        id: expect.any(Number),
        user_type_id: 2,
        role_id: storeToCreate.role_id,
        email: storeToCreate.email,
        password: expect.stringContaining('$2b$'),
        NIF: storeToCreate.NIF,
        address: storeToCreate.address,
        phone_number: storeToCreate.phone_number,
        hash: null,
        last_activity: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString().split('T')[0],
        updated_at: null,
        deleted_at: null,
      },
      name: storeToCreate.name,
      id: expect.any(Number),
      user_id: expect.any(Number),
      approved: false,
      updated_at: null,
    });
  });

  it('should update a store', async () => {
    const password = 'updatedPassword123';
    const storeToUpdate = {
      name: 'Updated Store Name',
      password,
    };
    const updatedStore = await service.update(1, storeToUpdate);
    const isPasswordCorrectlyHashed = await compareHashedPassword(
      password,
      updatedStore.user.password,
      pepper,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
    expect(updatedStore.name).toEqual(storeToUpdate.name);
  });

  it('should hard delete a store', async () => {
    const deletedStore = await service.hardDelete(1);

    expect(deletedStore).toEqual(true);
  });

  it('should soft delete a store', async () => {
    const deletedStore = await service.softDelete(1);

    expect(deletedStore).toEqual(true);
  });

  it('should restore a store', async () => {
    const restoredStore = await service.restore(1);

    expect(restoredStore).toEqual(true);
  });
});
