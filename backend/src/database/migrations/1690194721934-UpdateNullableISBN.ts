import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNullableISBN1690194721934 implements MigrationInterface {
    name = 'UpdateNullableISBN1690194721934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Book"
            ALTER COLUMN "ISBN" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Book"
            ALTER COLUMN "ISBN"
            SET NOT NULL
        `);
    }

}
