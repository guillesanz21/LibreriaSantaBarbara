import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareHashedPassword } from 'src/utils/hash-password';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

const testStore1 = {
  is_admin: false,
  email: 'test1@test.com',
  password: 'testpassword',
  name: 'Test Store 1',
  NIF: '123456789A',
  address: null,
  phone_number: '123456789',
  hash: null,
  last_activity: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testStoresArray = [{ id: 1, ...testStore1 }];

const pepper = 'test-pepper';

describe('StoresService', () => {
  let service: StoresService;
  let repo: Repository<Store>;
  let configService: ConfigService;

  const mockStoresRepository = {
    find: jest.fn().mockResolvedValue(testStoresArray),
    findOne: jest.fn().mockImplementation((fields) => {
      return { id: fields.where.id, ...testStore1 };
    }),
    create: jest
      .fn()
      .mockImplementation((storeDTO: CreateStoreDto) => storeDTO),
    save: jest.fn().mockImplementation((store: CreateStoreDto) =>
      Promise.resolve({
        id: Date.now(),
        is_admin: false,
        email: store.email,
        password: store.password,
        name: store.name,
        NIF: store.NIF,
        address: store.address,
        phone_number: store.phone_number,
        hash: null,
        last_activity: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString().split('T')[0],
        updated_at: null,
        deleted_at: null,
      }),
    ),
    update: jest
      .fn()
      .mockImplementation((id: number, store: UpdateStoreDto) =>
        Promise.resolve({ id, ...store }),
      ),
    // as these do not actually use their return values in our sample
    // we just make sure that their resolve is true to not crash
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    restore: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
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
    repo = module.get<Repository<Store>>(getRepositoryToken(Store));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
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
      email: testStore1.email,
      password: testStore1.password,
      name: testStore1.name,
      NIF: testStore1.NIF,
      address: testStore1.address,
      phone_number: testStore1.phone_number,
    };
    const createdStore = await service.create(storeToCreate);

    const isPasswordCorrectlyHashed = await compareHashedPassword(
      testStore1.password,
      createdStore.password,
      pepper,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);

    expect(createdStore).toEqual({
      id: expect.any(Number),
      is_admin: false,
      ...storeToCreate,
      password: expect.stringContaining('$2b$'),
      hash: null,
      last_activity: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0],
      updated_at: null,
      deleted_at: null,
    });
  });

  it('should update a store', async () => {
    const storeToUpdate = {
      name: 'Updated Store Name',
    };
    const updatedStore = await service.update(1, storeToUpdate);

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
