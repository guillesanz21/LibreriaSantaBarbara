import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareHashedPassword } from 'src/utils/hash-password';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

const testCustomer1 = {
  is_admin: false,
  email: 'test1@test.com',
  password: 'testpassword',
  provider: 'email',
  social_id: null,
  first_name: 'Test Customer Name 1',
  last_name: 'Test Customer Last Name 1',
  DNI: '123456789A',
  address: null,
  phone_number: '123456789',
  email_confirmed: false,
  hash: null,
  created_at: new Date().toISOString().split('T')[0],
  updated_at: null,
  deleted_at: null,
};

const testCustomersArray = [{ id: 1, ...testCustomer1 }];

const pepper = 'test-pepper';

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: Repository<Customer>;
  let configService: ConfigService;

  const mockCustomersRepository = {
    find: jest.fn().mockResolvedValue(testCustomersArray),
    findOne: jest.fn().mockImplementation((fields) => {
      return { id: fields.where.id, ...testCustomer1 };
    }),
    create: jest
      .fn()
      .mockImplementation((customerDTO: CreateCustomerDto) => customerDTO),
    save: jest.fn().mockImplementation((customer: CreateCustomerDto) =>
      Promise.resolve({
        id: Date.now(),
        is_admin: false,
        email: customer.email,
        password: customer.password,
        provider: 'email',
        social_id: null,
        first_name: customer.first_name,
        last_name: customer.last_name,
        DNI: customer.DNI,
        address: customer.address,
        phone_number: customer.phone_number,
        email_confirmed: false,
        hash: null,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: null,
        deleted_at: null,
      }),
    ),
    update: jest
      .fn()
      .mockImplementation((id: number, customer: UpdateCustomerDto) =>
        Promise.resolve({ id, ...customer }),
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
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomersRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(pepper),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should return an array of customers', async () => {
    const customers = await service.findMany({});
    expect(customers).toEqual(testCustomersArray);
  });

  it('should return an array of customers with pagination', async () => {
    const customers = await service.findManyWithPagination(
      {},
      { page: 1, limit: 10 },
    );
    expect(customers).toEqual(testCustomersArray);
  });

  it('should return a single customer', async () => {
    const customer = await service.findOne({ id: 1 });
    expect(customer).toEqual({ id: 1, ...testCustomer1 });
  });

  it('should create a customer with hashed password', async () => {
    const customerToCreate = {
      email: testCustomer1.email,
      password: testCustomer1.password,
      first_name: testCustomer1.first_name,
      last_name: testCustomer1.last_name,
      DNI: testCustomer1.DNI,
      address: testCustomer1.address,
      phone_number: testCustomer1.phone_number,
    };
    const createdCustomer = await service.create(customerToCreate);

    const isPasswordCorrectlyHashed = await compareHashedPassword(
      testCustomer1.password,
      createdCustomer.password,
      pepper,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);

    expect(createdCustomer).toEqual({
      id: expect.any(Number),
      is_admin: false,
      ...customerToCreate,
      provider: 'email',
      social_id: null,
      password: expect.stringContaining('$2b$'),
      email_confirmed: false,
      hash: null,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: null,
      deleted_at: null,
    });
  });

  it('should update a customer', async () => {
    const customerToUpdate = {
      first_name: 'Updated Customer Name',
    };
    const updatedCustomer = await service.update(1, customerToUpdate);

    expect(updatedCustomer.first_name).toEqual(customerToUpdate.first_name);
  });

  it('should hard delete a customer', async () => {
    const deletedCustomer = await service.hardDelete(1);

    expect(deletedCustomer).toEqual(true);
  });

  it('should soft delete a customer', async () => {
    const deletedCustomer = await service.softDelete(1);

    expect(deletedCustomer).toEqual(true);
  });

  it('should restore a customer', async () => {
    const restoredCustomer = await service.restore(1);

    expect(restoredCustomer).toEqual(true);
  });
});
