/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { compareHashedPassword } from 'src/utils/hash-password';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

const testUser1 = {
  user_type_id: 1,
  role_id: 1,
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
const testUser2 = {
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
const testUsersArray = [
  { id: 1, ...testUser1 },
  { id: 2, ...testUser2 },
];

const pepper = 'test-pepper';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;
  let configService: ConfigService;

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(testUsersArray),
    findOne: jest.fn().mockImplementation((fields) => {
      return { id: fields.where.id, ...testUser1 };
    }),
    create: jest.fn().mockImplementation((userDto: CreateUserDto) => userDto),
    save: jest.fn().mockImplementation((user: Partial<User>) =>
      Promise.resolve({
        id: Date.now(),
        user_type_id: 2,
        role_id: user.role_id,
        email: user.email,
        password: user.password,
        NIF: user.NIF,
        address: user.address,
        phone_number: user.phone_number,
        hash: null,
        last_activity: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString().split('T')[0],
        updated_at: null,
        deleted_at: null,
      }),
    ),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    restore: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(pepper),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepo).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should return an array of users', async () => {
    const users = await service.findMany({});
    expect(users).toEqual(testUsersArray);
  });

  it('should return an array of users with pagination', async () => {
    const users = await service.findManyWithPagination(
      {},
      { page: 1, limit: 10 },
    );
    expect(users).toEqual(testUsersArray);
  });

  it('should return a single user', async () => {
    const user = await service.findOne({ id: 1 });
    expect(user).toEqual({ id: 1, ...testUser1 });
  });

  it('should create a user with hashed password', async () => {
    const password = testUser1.password;
    const userToCreate = {
      role_id: testUser1.role_id,
      user_type_id: testUser1.user_type_id,
      email: testUser1.email,
      password,
      NIF: testUser1.NIF,
      address: testUser1.address,
      phone_number: testUser1.phone_number,
    };
    const createdUser = await service.create(userToCreate);

    const isPasswordCorrectlyHashed = await compareHashedPassword(
      password,
      createdUser.password,
      pepper,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);

    expect(createdUser).toEqual({
      id: expect.any(Number),
      user_type_id: 2,
      role_id: userToCreate.role_id,
      email: userToCreate.email,
      password: expect.stringContaining('$2b$'),
      NIF: userToCreate.NIF,
      address: userToCreate.address,
      phone_number: userToCreate.phone_number,
      hash: null,
      last_activity: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0],
      updated_at: null,
      deleted_at: null,
    });
  });

  it('should update a user', async () => {
    const password = 'updatedPassword123';
    const userToUpdate = {
      NIF: '123kj12k',
      password,
    };
    const updatedUser = await service.update(1, userToUpdate);
    const isPasswordCorrectlyHashed = await compareHashedPassword(
      password,
      updatedUser.password,
      pepper,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
    expect(updatedUser.NIF).toEqual(userToUpdate.NIF);
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
