import { NotFoundException } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

const testCustomer1 = {
  is_admin: false,
  email: 'test1@test.com',
  password: '$2b$10$asdkkasqoweku9c,..,91921.',
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

const testCustomer2 = {
  is_admin: false,
  email: 'test2@test.com',
  password: '$2b$10$1a012la,mp123so01[]-,.',
  first_name: 'Test Customer Name 2',
  last_name: 'Test Customer Last Name 2',
  DNI: '123456789B',
  address: null,
  phone_number: '69120938802',
  email_confirmed: false,
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testCustomer3 = {
  is_admin: false,
  email: 'test3@test.com',
  password: '$2b$10$129asl/.so01[]-,.',
  first_name: 'Test Customer Name 3',
  last_name: 'Test Customer Last Name 3',
  DNI: '123456789C',
  address: null,
  phone_number: '09120938801',
  email_confirmed: false,
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testCustomersArray = [
  { id: 1, ...testCustomer1 },
  { id: 2, ...testCustomer2 },
  { id: 3, ...testCustomer3 },
];

describe('Customer Controller', () => {
  let controller: CustomersController;

  // Mock the CustomerService to return values we are expecting.
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
      email: 'tesT3@TEST.com', // The email is lowercased and trimmed in the DTO
      password: 'testest', // The password is hashed in the service
      first_name: testCustomer3.first_name,
      last_name: testCustomer3.last_name,
      DNI: testCustomer3.DNI,
      address: testCustomer3.address,
      phone_number: testCustomer3.phone_number,
    };
    const returnedCustomer = await controller.create(customerToCreate);
    delete testCustomer3.password;

    expect(returnedCustomer).toEqual({
      id: expect.any(Number),
      password: expect.stringContaining('$2b$'), // Expect hashed password
      ...testCustomer3,
    });

    expect(mockCustomersService.create).toHaveBeenCalledWith(customerToCreate);
  });

  it('should update a customer and return the updated customer', async () => {
    const updateFields = {
      // Required fields
      first_name: 'Test Name Updated',
    };

    expect(await controller.update(1, updateFields)).toEqual({
      id: 1,
      ...updateFields,
    });

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
    expect(typeof returnedCustomer).toBe('boolean');
    expect(returnedCustomer).toBe(true);

    expect(mockCustomersService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should hard delete a customer and return true', async () => {
    const returnedCustomer = await controller.remove(1, 'hard');
    expect(typeof returnedCustomer).toBe('boolean');
    expect(returnedCustomer).toBe(true);

    expect(mockCustomersService.softDelete).toHaveBeenCalledWith(1);
  });

  it('should restore a customer and return true', async () => {
    const returnedCustomer = await controller.restore(1);
    expect(typeof returnedCustomer).toBe('boolean');
    expect(returnedCustomer).toBe(true);

    expect(mockCustomersService.restore).toHaveBeenCalledWith(1);
  });

  it('findOne throws an error if user with given id is not found', async () => {
    mockCustomersService.findOne = jest.fn().mockResolvedValue(null);
    await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
  });
});
