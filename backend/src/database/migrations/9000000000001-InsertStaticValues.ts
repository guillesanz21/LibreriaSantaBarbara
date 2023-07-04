import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertStaticValues9000000000001 implements MigrationInterface {
  name = 'InsertStaticValues9000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert static roles into the Role table
    await queryRunner.query(`
            INSERT INTO "Role" ("id", "role") VALUES (1, 'admin')
        `);
    await queryRunner.query(`
            INSERT INTO "Role" ("id", "role") VALUES (2, 'store')
        `);
    await queryRunner.query(`
            INSERT INTO "Role" ("id", "role") VALUES (3, 'customer')
        `);
    await queryRunner.query(`
            INSERT INTO "Role" ("id", "role") VALUES (4, 'unapprovedStore')
        `);
    await queryRunner.query(`
            INSERT INTO "Role" ("id", "role") VALUES (5, 'unconfirmedCustomer')
        `);
    await queryRunner.query(`
            INSERT INTO "Role" ("id", "role") VALUES (6, 'guest')
        `);
    // insert static user types into the User_Type table
    await queryRunner.query(`
            INSERT INTO "User_Type" ("id", "user_type") VALUES (1, 'admin')
        `);
    await queryRunner.query(`
            INSERT INTO "User_Type" ("id", "user_type") VALUES (2, 'store')
        `);
    await queryRunner.query(`
            INSERT INTO "User_Type" ("id", "user_type") VALUES (3, 'customer')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // delete static roles from the Role table
    await queryRunner.query(`
            DELETE FROM "Role" WHERE "id" = 1
        `);
    await queryRunner.query(`
            DELETE FROM "Role" WHERE "id" = 2
        `);
    await queryRunner.query(`
            DELETE FROM "Role" WHERE "id" = 3
        `);
    await queryRunner.query(`
            DELETE FROM "Role" WHERE "id" = 4
        `);
    await queryRunner.query(`
            DELETE FROM "Role" WHERE "id" = 5
        `);
    await queryRunner.query(`
            DELETE FROM "Role" WHERE "id" = 6
        `);
    // delete static user types from the User_Type table
    await queryRunner.query(`
            DELETE FROM "User_Type" WHERE "id" = 1
        `);
    await queryRunner.query(`
            DELETE FROM "User_Type" WHERE "id" = 2
        `);
    await queryRunner.query(`
            DELETE FROM "User_Type" WHERE "id" = 3
        `);
  }
}
