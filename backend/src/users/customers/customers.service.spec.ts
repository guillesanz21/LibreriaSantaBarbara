import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareHashedPassword } from 'src/utils/hash-password';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';

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

const pepper = 'test-pepper';

describe('CustomersService', () => {
  let service: CustomersService;
  let userRepo: Repository<User>;
  let customerRepo: Repository<Customer>;
  let configService: ConfigService;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation((UserDto: CreateUserDto) => UserDto),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    restore: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const mockCustomersRepository = {
    find: jest.fn().mockResolvedValue(testCustomersArray),
    findOne: jest.fn().mockImplementation((fields) => {
      return { id: fields.where.id, ...testCustomer1 };
    }),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(testCustomer1),
    }),
    create: jest
      .fn()
      .mockImplementation((customerDTO: CreateCustomerDto) => customerDTO),
    save: jest.fn().mockImplementation((customer: CreateCustomerDto) =>
      Promise.resolve({
        id: Date.now(),
        user_id: Date.now() + 1,
        email_confirmed: false,
        user: {
          id: Date.now() + 1,
          user_type_id: 2,
          role_id: customer.role_id,
          email: customer.email,
          password: customer.password,
          NIF: customer.NIF,
          address: customer.address,
          phone_number: customer.phone_number,
          hash: null,
          last_activity: new Date().toISOString().split('T')[0],
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
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
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    customerRepo = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepo).toBeDefined();
    expect(customerRepo).toBeDefined();
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
    const storeToCreate = {
      role_id: testUser1.role_id,
      email: testUser1.email,
      password: testUser1.password,
      first_name: testCustomer1.first_name,
      last_name: testCustomer1.last_name,
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
      first_name: storeToCreate.first_name,
      last_name: storeToCreate.last_name,
      id: expect.any(Number),
      user_id: expect.any(Number),
      email_confirmed: false,
      provider: 'email',
      social_id: null,
      updated_at: null,
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
