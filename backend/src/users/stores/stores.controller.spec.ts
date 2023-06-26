/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

const testStore1 = {
  is_admin: false,
  email: 'test1@test.com',
  password: '$2b$10$asdkkasqoweku9c,..,91921.',
  name: 'Test Store 1',
  NIF: '123456789A',
  address: null,
  phone_number: '123456789',
  last_activity: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testStore2 = {
  is_admin: false,
  email: 'test2@test.com',
  password: '$2b$10$1a012la,mp123so01[]-,.',
  name: 'Test Store 2',
  NIF: '123456789B',
  address: null,
  phone_number: '69120938802',
  last_activity: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testStore3 = {
  is_admin: false,
  email: 'test3@test.com',
  password: '$2b$10$129asl/.so01[]-,.',
  name: 'Test Store 3',
  NIF: '123456789C',
  address: null,
  phone_number: '09120938801',
  last_activity: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testStoresArray = [
  { id: 1, ...testStore1 },
  { id: 2, ...testStore2 },
  { id: 3, ...testStore3 },
];

describe('Store Controller', () => {
  let controller: StoresController;

  // Mock the StoreService to return values we are expecting.
  const mockStoresService = {
    create: jest.fn().mockImplementation((store: CreateStoreDto) =>
      Promise.resolve({
        id: Date.now(),
        is_admin: false,
        email: store.email.toLowerCase().trim(), // This simulate the transformation in the DTO
        password: '$2b$10$asdkkasqoweku9c,..,91921.',
        name: store.name,
        NIF: store.NIF,
        address: store.address,
        phone_number: store.phone_number,
        last_activity: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString().split('T')[0],
        updated_at: null,
        deleted_at: null,
      }),
    ),
    findOne: jest
      .fn()
      .mockImplementation((fields: { id: number }) =>
        Promise.resolve({ ...testStore1, id: fields.id }),
      ),
    findMany: jest.fn().mockResolvedValue(testStoresArray),
    findManyWithPagination: jest
      .fn()
      .mockImplementation(
        (fields, paginationOptions: { page: number; limit: number }) =>
          Promise.resolve(testStoresArray),
      ),
    update: jest
      .fn()
      .mockImplementation((id: number, store: UpdateStoreDto) =>
        Promise.resolve({ id, ...store }),
      ),
    hardDelete: jest
      .fn()
      .mockImplementation((id: number) => Promise.resolve(true)),
    softDelete: jest
      .fn()
      .mockImplementation((id: number) => Promise.resolve(true)),
    restore: jest
      .fn()
      .mockImplementation((id: number) => Promise.resolve(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [StoresService],
    })
      .overrideProvider(StoresService)
      .useValue(mockStoresService)
      .compile();

    controller = module.get<StoresController>(StoresController);
  });

  /**
   * These all may seem like simple tests that don't do much, but in reality
   * the controller itself is pretty simple. Call a service and return it's value,
   * the complicated stuff comes in either in the service, a pipe, or the interceptor
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a store and return the created store', async () => {
    const storeToCreate = {
      email: 'tesT3@TEST.com', // The email is lowercased and trimmed in the DTO
      password: 'testest', // The password is hashed in the service
      name: testStore3.name,
      NIF: testStore3.NIF,
      address: testStore3.address,
      phone_number: testStore3.phone_number,
    };
    const returnedStore = await controller.create(storeToCreate);
    delete testStore3.password;

    expect(returnedStore).toEqual({
      id: expect.any(Number),
      password: expect.stringContaining('$2b$'), // Expect hashed password
      ...testStore3,
    });

    expect(mockStoresService.create).toHaveBeenCalledWith(storeToCreate);
  });

  it('should update a store and return the updated store', async () => {
    const updateFields = {
      // Required fields
      name: 'Test Store Updated',
    };

    expect(await controller.update(1, updateFields)).toEqual({
      id: 1,
      ...updateFields,
    });

    expect(mockStoresService.update).toHaveBeenCalledWith(1, updateFields);
  });

  it('should get a store by id and return the store', async () => {
    const returnedStore = await controller.findOne(1);
    expect(typeof returnedStore).toBe('object');
    expect(returnedStore).toEqual({
      id: 1,
      ...testStore1,
    });

    expect(mockStoresService.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should get all stores and return the array of stores', async () => {
    const returnedStores = await controller.findMany();
    expect(typeof returnedStores).toBe('object');
    expect(returnedStores).toEqual(testStoresArray);
    expect(mockStoresService.findMany).toHaveBeenCalled();
  });

  it('should get all stores with pagination and return the array of stores', async () => {
    const returnedStores = await controller.findManyWithPagination(1, 10);
    expect(typeof returnedStores).toBe('object');
    expect(returnedStores).toEqual({
      data: testStoresArray,
      hasNextPage: false,
    });
    expect(mockStoresService.findManyWithPagination).toHaveBeenCalledWith(
      {},
      { page: 1, limit: 10 },
    );
  });

  it('should soft delete a store and return true', async () => {
    const returnedStore = await controller.remove(1);
    expect(typeof returnedStore).toBe('boolean');
    expect(returnedStore).toBe(true);

    expect(mockStoresService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should hard delete a store and return true', async () => {
    const returnedStore = await controller.remove(1, 'hard');
    expect(typeof returnedStore).toBe('boolean');
    expect(returnedStore).toBe(true);

    expect(mockStoresService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should restore a store and return true', async () => {
    const returnedStore = await controller.restore(1);
    expect(typeof returnedStore).toBe('boolean');
    expect(returnedStore).toBe(true);

    expect(mockStoresService.restore).toHaveBeenCalledWith(1);
  });

  it('findOne throws an error if user with given id is not found', async () => {
    mockStoresService.findOne = jest.fn().mockResolvedValue(null);
    await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
  });
});
