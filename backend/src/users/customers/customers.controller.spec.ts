import { NotFoundException } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

const testUser1 = {
  id: 2,
  user_type_id: 3,
  role_id: 3,
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
const testCustomer1 = {
  user_id: testUser1.id,
  email_confirmed: false,
  provider: 'email',
  social_id: null,
  first_name: 'Test Customer Name 1',
  last_name: 'Test Customer Last Name 1',
  updated_at: null,
  user: testUser1,
};

const testUser2 = {
  id: 3,
  user_type_id: 3,
  role_id: 3,
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
const testCustomer2 = {
  user_id: testUser2.id,
  email_confirmed: true,
  provider: 'email',
  social_id: null,
  first_name: 'Test Customer Name 2',
  last_name: 'Test Customer Last Name 2',
  updated_at: null,
  user: testUser2,
};

const testCustomersArray = [
  { id: 1, ...testCustomer1 },
  { id: 2, ...testCustomer2 },
];

describe('Customer Controller', () => {
  let controller: CustomersController;

  // Mock the CustomerService to return values we are expecting.
  const mockCustomersService = {
    create: jest.fn().mockImplementation((customer: CreateCustomerDto) =>
      Promise.resolve({
        id: Date.now(),
        user_id: Date.now() + 1,
        email_confirmed: false,
        user: {
          id: Date.now() + 1,
          user_type_id: 3,
          role_id: customer.role_id,
          email: customer.email.toLowerCase().trim(), // This simulate the transformation in the DTO
          password: '$2b$10$asdkkasqoweku9c,..,91921.',
          NIF: customer.NIF,
          address: customer.address,
          phone_number: customer.phone_number,
          hash: null,
          created_at: new Date().toISOString().split('T')[0],
          updated_at: null,
          deleted_at: null,
        },
        provider: 'email',
        social_id: null,
        first_name: customer.first_name,
        last_name: customer.last_name,
        updated_at: null,
      }),
    ),
    findOne: jest
      .fn()
      .mockImplementation((fields: { id: number }) =>
        Promise.resolve({ ...testCustomer1, id: fields.id }),
      ),
    findMany: jest.fn().mockResolvedValue(testCustomersArray),
    findManyWithPagination: jest
      .fn()
      .mockImplementation(
        (fields, paginationOptions: { page: number; limit: number }) =>
          Promise.resolve(testCustomersArray),
      ),
    update: jest
      .fn()
      .mockImplementation((id: number, customer: UpdateCustomerDto) =>
        Promise.resolve({ id, ...customer }),
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
      controllers: [CustomersController],
      providers: [CustomersService],
    })
      .overrideProvider(CustomersService)
      .useValue(mockCustomersService)
      .compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  /**
   * These all may seem like simple tests that don't do much, but in reality
   * the controller itself is pretty simple. Call a service and return it's value,
   * the complicated stuff comes in either in the service, a pipe, or the interceptor
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a customer and return the created customer', async () => {
    const customerToCreate = {
      role_id: 3,
      email: 'tesT1@TEST.com', // The email is lowercased and trimmed in the DTO
      password: 'testest', // The password is hashed in the service
      first_name: testCustomer1.first_name,
      last_name: testCustomer1.last_name,
      NIF: testCustomer1.user.NIF,
      address: testCustomer1.user.address,
      phone_number: testCustomer1.user.phone_number,
    };
    const returnedCustomer = await controller.create(customerToCreate);
    delete testCustomer1.user.password;
    delete testCustomer1.user.id;

    expect(returnedCustomer).toEqual({
      id: expect.any(Number),
      user_id: expect.any(Number),
      email_confirmed: false,
      user: {
        id: expect.any(Number),
        password: expect.stringContaining('$2b$'), // Expect hashed password
        user_type_id: 3,
        ...testCustomer1.user,
      },
      provider: 'email',
      social_id: null,
      first_name: customerToCreate.first_name,
      last_name: customerToCreate.last_name,
      updated_at: null,
    });

    expect(mockCustomersService.create).toHaveBeenCalledWith(customerToCreate);
  });

  it('should update a customer and return the updated customer', async () => {
    const updateFields = {
      // Required fields
      first_name: 'Test Name Updated',
    };

    expect(await controller.update(1, updateFields)).toBeUndefined();

    expect(mockCustomersService.update).toHaveBeenCalledWith(1, updateFields);
  });

  it('should get a customer by id and return the customer', async () => {
    const returnedCustomer = await controller.findOne(1);
    expect(typeof returnedCustomer).toBe('object');
    expect(returnedCustomer).toEqual({
      id: 1,
      ...testCustomer1,
    });

    expect(mockCustomersService.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should get all customers and return the array of customers', async () => {
    const returnedCustomers = await controller.findMany();
    expect(typeof returnedCustomers).toBe('object');
    expect(returnedCustomers).toEqual(testCustomersArray);
    expect(mockCustomersService.findMany).toHaveBeenCalled();
  });

  it('should get all customers with pagination and return the array of customers', async () => {
    const returnedCustomers = await controller.findManyWithPagination(1, 10);
    expect(typeof returnedCustomers).toBe('object');
    expect(returnedCustomers).toEqual({
      data: testCustomersArray,
      hasNextPage: false,
    });
    expect(mockCustomersService.findManyWithPagination).toHaveBeenCalledWith(
      {},
      { page: 1, limit: 10 },
    );
  });

  it('should soft delete a customer and return true', async () => {
    const returnedCustomer = await controller.remove(1);
    expect(returnedCustomer).toBeUndefined();

    expect(mockCustomersService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should hard delete a customer and return true', async () => {
    const returnedCustomer = await controller.remove(1, 'hard');
    expect(returnedCustomer).toBeUndefined();

    expect(mockCustomersService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should restore a customer and return true', async () => {
    const returnedCustomer = await controller.restore(1);
    expect(returnedCustomer).toBeUndefined();

    expect(mockCustomersService.restore).toHaveBeenCalledWith(1);
  });

  it('findOne throws an error if user with given id is not found', async () => {
    mockCustomersService.findOne = jest.fn().mockResolvedValue(null);
    await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('update throws an error if user with given id is not found', async () => {
    mockCustomersService.update = jest.fn().mockResolvedValue(null);
    await expect(controller.update(1, {})).rejects.toThrow(NotFoundException);
  });

  it('remove throws an error if user with given id is not found', async () => {
    mockCustomersService.softDelete = jest.fn().mockResolvedValue(null);
    await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('restore throws an error if user with given id is not found', async () => {
    mockCustomersService.restore = jest.fn().mockResolvedValue(null);
    await expect(controller.restore(1)).rejects.toThrow(NotFoundException);
  });
});
