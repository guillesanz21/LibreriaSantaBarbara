/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { StoresService } from './stores/stores.service';
import { CustomersService } from './customers/customers.service';
import { UpdateStoreDto } from './stores/dtos/update-store.dto';
import { CreateStoreDto } from './stores/dtos/create-store.dto';
import { UpdateCustomerDto } from './customers/dtos/update-customer.dto';
import { CreateCustomerDto } from './customers/dtos/create-customer.dto';

const testStore = {
  is_admin: false,
  email: 'test1@test.com',
  password: 'testpassword',
  name: 'Test Store 1',
  NIF: '123456789A',
  address: null,
  phone_number: '123456789',
  last_activity: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testCustomer = {
  is_admin: false,
  email: 'test1@test.com',
  password: 'testpassword',
  first_name: 'Test Customer Name 1',
  last_name: 'Test Customer Last Name 1',
  DNI: '123456789A',
  address: null,
  phone_number: '123456789',
  email_confirmed: false,
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

describe('UsersService', () => {
  let service: UsersService;

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
        Promise.resolve({ ...testStore, id: fields.id }),
      ),
    update: jest
      .fn()
      .mockImplementation((id: number, store: UpdateStoreDto) =>
        Promise.resolve({ id, ...store }),
      ),
    softDelete: jest
      .fn()
      .mockImplementation((id: number) => Promise.resolve(true)),
  };

  const mockCustomersService = {
    create: jest.fn().mockImplementation((customer: CreateCustomerDto) =>
      Promise.resolve({
        id: Date.now(),
        is_admin: false,
        email: customer.email.toLowerCase().trim(), // This simulate the transformation in the DTO
        password: '$2b$10$asdkkasqoweku9c,..,91921.',
        first_name: customer.first_name,
        last_name: customer.last_name,
        DNI: customer.DNI,
        address: customer.address,
        phone_number: customer.phone_number,
        email_confirmed: false,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: null,
        deleted_at: null,
      }),
    ),
    findOne: jest
      .fn()
      .mockImplementation((fields: { id: number }) =>
        Promise.resolve({ ...testCustomer, id: fields.id }),
      ),

    update: jest
      .fn()
      .mockImplementation((id: number, customer: UpdateCustomerDto) =>
        Promise.resolve({ id, ...customer }),
      ),
    softDelete: jest
      .fn()
      .mockImplementation((id: number) => Promise.resolve(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: StoresService, useValue: mockStoresService },
        { provide: CustomersService, useValue: mockCustomersService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a store', async () => {
    const storeToCreate = {
      email: 'tesT1@TEST.com',
      password: 'testest',
      name: testStore.name,
      NIF: testStore.NIF,
      address: testStore.address,
      phone_number: testStore.phone_number,
    };
    const returnedStore = await service.create('store', storeToCreate);
    delete testStore.password;

    expect(returnedStore).toEqual({
      id: expect.any(Number),
      password: expect.stringContaining('$2b$'), // Expect hashed password
      ...testStore,
    });

    expect(mockStoresService.create).toHaveBeenCalledWith(storeToCreate);
  });

  it('should create a customer', async () => {
    const customerToCreate = {
      email: 'tesT1@TEST.com', // The email is lowercased and trimmed in the DTO
      password: 'testest', // The password is hashed in the service
      first_name: testCustomer.first_name,
      last_name: testCustomer.last_name,
      DNI: testCustomer.DNI,
      address: testCustomer.address,
      phone_number: testCustomer.phone_number,
    };
    const returnedCustomer = await service.create('customer', customerToCreate);
    delete testCustomer.password;

    expect(returnedCustomer).toEqual({
      id: expect.any(Number),
      password: expect.stringContaining('$2b$'), // Expect hashed password
      ...testCustomer,
    });

    expect(mockCustomersService.create).toHaveBeenCalledWith(customerToCreate);
  });

  it('should find a store by ID', async () => {
    const returnedStore = await service.findOne('store', { id: 1 });

    expect(typeof returnedStore).toBe('object');
    expect(returnedStore).toEqual({
      id: 1,
      ...testStore,
    });

    expect(mockStoresService.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should find a store by email', async () => {
    const returnedStore = await service.findOne('store', {
      email: testStore.email,
    });

    expect(typeof returnedStore).toBe('object');
    expect(returnedStore).toEqual({
      email: testStore.email,
      ...testStore,
    });

    expect(mockStoresService.findOne).toHaveBeenCalledWith({
      email: testStore.email,
    });
  });

  it('should find a customer by ID', async () => {
    const returnedCustomer = await service.findOne('customer', { id: 1 });

    expect(typeof returnedCustomer).toBe('object');
    expect(returnedCustomer).toEqual({
      id: 1,
      ...testCustomer,
    });

    expect(mockCustomersService.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should find a customer by email', async () => {
    const returnedCustomer = await service.findOne('customer', {
      email: testCustomer.email,
    });

    expect(typeof returnedCustomer).toBe('object');
    expect(returnedCustomer).toEqual({
      email: testCustomer.email,
      ...testCustomer,
    });

    expect(mockCustomersService.findOne).toHaveBeenCalledWith({
      email: testCustomer.email,
    });
  });

  it('should update a store', async () => {
    const updateFields = {
      // Required fields
      name: 'Test Store Updated',
    };

    expect(await service.update('store', 1, updateFields)).toEqual({
      id: 1,
      ...updateFields,
    });

    expect(mockStoresService.update).toHaveBeenCalledWith(1, updateFields);
  });

  it('should update a customer', async () => {
    const updateFields = {
      // Required fields
      name: 'Test Customer Updated',
    };

    expect(await service.update('customer', 1, updateFields)).toEqual({
      id: 1,
      ...updateFields,
    });

    expect(mockCustomersService.update).toHaveBeenCalledWith(1, updateFields);
  });

  it('should soft delete a store', async () => {
    expect(await service.softDelete('store', 1)).toBe(true);
    expect(mockStoresService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should soft delete a customer', async () => {
    expect(await service.softDelete('customer', 1)).toBe(true);
    expect(mockCustomersService.softDelete).toHaveBeenCalledWith(1);
  });
});
