/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

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

describe('Store Controller', () => {
  let controller: StoresController;

  // Mock the StoreService to return values we are expecting.
  const mockStoresService = {
    create: jest.fn().mockImplementation((store: CreateStoreDto) =>
      Promise.resolve({
        id: Date.now(),
        user_id: Date.now() + 1,
        approved: false,
        user: {
          id: Date.now() + 1,
          user_type_id: 2,
          role_id: store.role_id,
          email: store.email.toLowerCase().trim(), // This simulate the transformation in the DTO
          password: '$2b$10$asdkkasqoweku9c,..,91921.',
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
      role_id: 2,
      email: 'tesT1@TEST.com', // The email is lowercased and trimmed in the DTO
      password: 'testest', // The password is hashed in the service
      name: testStore1.name,
      NIF: testStore1.user.NIF,
      address: testStore1.user.address,
      phone_number: testStore1.user.phone_number,
    };
    const returnedStore = await controller.create(storeToCreate);
    delete testStore1.user.password;
    delete testStore1.user.id;

    expect(returnedStore).toEqual({
      id: expect.any(Number),
      user_id: expect.any(Number),
      approved: false,
      user: {
        id: expect.any(Number),
        password: expect.stringContaining('$2b$'), // Expect hashed password
        last_activity: expect.any(String),
        created_at: expect.any(String),
        updated_at: null,
        deleted_at: null,
        ...testStore1.user,
      },
      name: storeToCreate.name,
      updated_at: null,
    });

    expect(mockStoresService.create).toHaveBeenCalledWith(storeToCreate);
  });

  it('should update a store and return the updated store', async () => {
    const updateFields = {
      // Required fields
      name: 'Test Store Updated',
    };

    expect(await controller.update(1, updateFields)).toBeUndefined();

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
    expect(returnedStore).toBeUndefined();

    expect(mockStoresService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should hard delete a store and return true', async () => {
    const returnedStore = await controller.remove(1, 'hard');
    expect(returnedStore).toBeUndefined();

    expect(mockStoresService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should restore a store and return true', async () => {
    const returnedStore = await controller.restore(1);
    expect(returnedStore).toBeUndefined();

    expect(mockStoresService.restore).toHaveBeenCalledWith(1);
  });

  it('findOne throws an error if user with given id is not found', async () => {
    mockStoresService.findOne = jest.fn().mockResolvedValue(null);
    await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('update throws an error if user with given id is not found', async () => {
    mockStoresService.update = jest.fn().mockResolvedValue(null);
    await expect(controller.update(1, {})).rejects.toThrow(NotFoundException);
  });

  it('remove throws an error if user with given id is not found', async () => {
    mockStoresService.softDelete = jest.fn().mockResolvedValue(null);
    await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('restore throws an error if user with given id is not found', async () => {
    mockStoresService.restore = jest.fn().mockResolvedValue(null);
    await expect(controller.restore(1)).rejects.toThrow(NotFoundException);
  });
});
