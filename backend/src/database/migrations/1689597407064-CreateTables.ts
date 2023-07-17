import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1689597407064 implements MigrationInterface {
  name = 'CreateTables1689597407064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "Forgot" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "hash" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "PK_0406907c9846b95ddfb05a804c0" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e748f84f8974537d8ef198d661" ON "Forgot" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_c4770d66a9d43e7af538f615da" ON "Forgot" ("hash")
        `);
    await queryRunner.query(`
            CREATE TABLE "Role" (
                "id" integer NOT NULL,
                "role" text NOT NULL,
                CONSTRAINT "UQ_7e5fbe13db7686818270d8e46fa" UNIQUE ("role"),
                CONSTRAINT "PK_9309532197a7397548e341e5536" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "User_Type" (
                "id" integer NOT NULL,
                "user_type" text NOT NULL,
                CONSTRAINT "UQ_e0cf56def093f7b958eaa072de7" UNIQUE ("user_type"),
                CONSTRAINT "PK_b72b6bd5265a683ae446b1feb0c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "Customer" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "provider" character varying NOT NULL DEFAULT 'email',
                "social_id" text,
                "first_name" text,
                "last_name" text,
                "updated_at" date DEFAULT now(),
                CONSTRAINT "UQ_8171a61aa570303df5ba3ba8d37" UNIQUE ("user_id"),
                CONSTRAINT "REL_8171a61aa570303df5ba3ba8d3" UNIQUE ("user_id"),
                CONSTRAINT "PK_60596e16740e1fa20dbf0154ec7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8171a61aa570303df5ba3ba8d3" ON "Customer" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0a75a9ec86ce60aa15a196577f" ON "Customer" ("social_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "User" (
                "id" SERIAL NOT NULL,
                "user_type_id" integer NOT NULL,
                "role_id" integer NOT NULL,
                "email" text NOT NULL,
                "password" text,
                "NIF" text,
                "address" text,
                "phone_number" text,
                "email_confirmed" boolean NOT NULL DEFAULT false,
                "hash" text,
                "created_at" date NOT NULL DEFAULT now(),
                "updated_at" date DEFAULT now(),
                "deleted_at" date,
                CONSTRAINT "UQ_10ab0d9dcc3c029fac3afe3666a" UNIQUE ("NIF", "user_type_id"),
                CONSTRAINT "UQ_65b914bd0312bce9aefcc95afbd" UNIQUE ("email", "user_type_id"),
                CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_57e82579dc42b2a7e332d47b2f" ON "User" ("user_type_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_775147058c769ea57efe923d28" ON "User" ("role_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4a257d2c9837248d70640b3e36" ON "User" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_cefd410393729bb8436c91bede" ON "User" ("hash")
        `);
    await queryRunner.query(`
            CREATE TABLE "Location" (
                "id" SERIAL NOT NULL,
                "store_id" integer NOT NULL DEFAULT '1',
                "location" text NOT NULL,
                CONSTRAINT "UQ_09e70ef7d6ccdc4c32fa163c07f" UNIQUE ("location"),
                CONSTRAINT "UQ_de3cb010751b2e36d833fac79ca" UNIQUE ("location", "store_id"),
                CONSTRAINT "PK_d0125e359cde2707aec388b9c59" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_d3fbd36fb038c22b0c2c852c63" ON "Location" ("store_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Store" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "approved" boolean NOT NULL DEFAULT false,
                "name" text NOT NULL,
                "last_activity" date NOT NULL DEFAULT now(),
                "updated_at" date DEFAULT now(),
                CONSTRAINT "UQ_24b77135d0ceb5b544b8c614d8e" UNIQUE ("user_id"),
                CONSTRAINT "UQ_9eaca0d487c79c671de2e536066" UNIQUE ("name"),
                CONSTRAINT "REL_24b77135d0ceb5b544b8c614d8" UNIQUE ("user_id"),
                CONSTRAINT "PK_f20e3845680debc547e49355a89" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_24b77135d0ceb5b544b8c614d8" ON "Store" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_9eaca0d487c79c671de2e53606" ON "Store" ("name")
        `);
    await queryRunner.query(`
            CREATE TABLE "Status" (
                "id" SERIAL NOT NULL,
                "status" text NOT NULL,
                CONSTRAINT "UQ_caf0be1702a2c1ed75159b07d8f" UNIQUE ("status"),
                CONSTRAINT "PK_343536a4489d5ce9d993aba7776" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "Language" (
                "id" SERIAL NOT NULL,
                "book_id" integer NOT NULL,
                "language" text NOT NULL,
                CONSTRAINT "PK_5abd0de610ce0c31b727f5547ec" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_409bc9fd2ae130114c2e098a93" ON "Language" ("book_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Topic" (
                "id" SERIAL NOT NULL,
                "topic" text NOT NULL,
                CONSTRAINT "UQ_5dbfad8a6f136d3fd3f67b6b52b" UNIQUE ("topic"),
                CONSTRAINT "PK_17a781ab2fa7e28e51b589bf95c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "Keyword" (
                "id" SERIAL NOT NULL,
                "book_id" integer NOT NULL,
                "keyword" text NOT NULL,
                CONSTRAINT "PK_c4ad165a78a72334ec6be8734bd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_966409202478432786fdf607ea" ON "Keyword" ("book_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Image" (
                "id" SERIAL NOT NULL,
                "book_id" integer NOT NULL,
                "url" text NOT NULL,
                CONSTRAINT "PK_ddecd6b02f6dd0d3d10a0a74717" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e4174c535992fe14b0b1f588cf" ON "Image" ("book_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Book" (
                "id" SERIAL NOT NULL,
                "store_id" integer NOT NULL DEFAULT '1',
                "location_id" integer,
                "status_id" integer NOT NULL DEFAULT '1',
                "ref" integer NOT NULL,
                "ISBN" text NOT NULL,
                "title" text NOT NULL,
                "author" text,
                "publication_place" text,
                "publisher" text,
                "collection" text,
                "year" integer,
                "size" text,
                "weight" integer,
                "pages" integer,
                "condition" text,
                "description" text,
                "price" integer NOT NULL,
                "stock" integer DEFAULT '1',
                "binding" text,
                "private_note" text,
                "created_at" date NOT NULL DEFAULT now(),
                "updated_at" date DEFAULT now(),
                "sold_at" date,
                "deleted_at" date,
                CONSTRAINT "UQ_3113aa5430d58f3be4fcffc86a2" UNIQUE ("ref", "store_id"),
                CONSTRAINT "PK_1cd110bae01e3fa29a83eeedba8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_dde618087261cdf6072ba2169a" ON "Book" ("store_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a516ec022159f434923f8209f7" ON "Book" ("location_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a8057e34852fe1a3f422e04656" ON "Book" ("status_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Topic_of_Book" (
                "book_id" integer NOT NULL,
                "topic_id" integer NOT NULL,
                CONSTRAINT "PK_adbda0199c6822b51d22ea5f82c" PRIMARY KEY ("book_id", "topic_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_78c0f439caaae08089d0405264" ON "Topic_of_Book" ("book_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ff3831b17779b3aa1e2f51ca50" ON "Topic_of_Book" ("topic_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "Forgot"
            ADD CONSTRAINT "FK_e748f84f8974537d8ef198d661b" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Customer"
            ADD CONSTRAINT "FK_8171a61aa570303df5ba3ba8d37" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "User"
            ADD CONSTRAINT "FK_57e82579dc42b2a7e332d47b2fb" FOREIGN KEY ("user_type_id") REFERENCES "User_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "User"
            ADD CONSTRAINT "FK_775147058c769ea57efe923d288" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Location"
            ADD CONSTRAINT "FK_d3fbd36fb038c22b0c2c852c636" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Store"
            ADD CONSTRAINT "FK_24b77135d0ceb5b544b8c614d8e" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Language"
            ADD CONSTRAINT "FK_409bc9fd2ae130114c2e098a930" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Keyword"
            ADD CONSTRAINT "FK_966409202478432786fdf607eab" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Image"
            ADD CONSTRAINT "FK_e4174c535992fe14b0b1f588cf9" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Book"
            ADD CONSTRAINT "FK_dde618087261cdf6072ba2169a7" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Book"
            ADD CONSTRAINT "FK_a516ec022159f434923f8209f70" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Book"
            ADD CONSTRAINT "FK_a8057e34852fe1a3f422e046562" FOREIGN KEY ("status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Topic_of_Book"
            ADD CONSTRAINT "FK_78c0f439caaae08089d04052648" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Topic_of_Book"
            ADD CONSTRAINT "FK_ff3831b17779b3aa1e2f51ca505" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "Topic_of_Book" DROP CONSTRAINT "FK_ff3831b17779b3aa1e2f51ca505"
        `);
    await queryRunner.query(`
            ALTER TABLE "Topic_of_Book" DROP CONSTRAINT "FK_78c0f439caaae08089d04052648"
        `);
    await queryRunner.query(`
            ALTER TABLE "Book" DROP CONSTRAINT "FK_a8057e34852fe1a3f422e046562"
        `);
    await queryRunner.query(`
            ALTER TABLE "Book" DROP CONSTRAINT "FK_a516ec022159f434923f8209f70"
        `);
    await queryRunner.query(`
            ALTER TABLE "Book" DROP CONSTRAINT "FK_dde618087261cdf6072ba2169a7"
        `);
    await queryRunner.query(`
            ALTER TABLE "Image" DROP CONSTRAINT "FK_e4174c535992fe14b0b1f588cf9"
        `);
    await queryRunner.query(`
            ALTER TABLE "Keyword" DROP CONSTRAINT "FK_966409202478432786fdf607eab"
        `);
    await queryRunner.query(`
            ALTER TABLE "Language" DROP CONSTRAINT "FK_409bc9fd2ae130114c2e098a930"
        `);
    await queryRunner.query(`
            ALTER TABLE "Store" DROP CONSTRAINT "FK_24b77135d0ceb5b544b8c614d8e"
        `);
    await queryRunner.query(`
            ALTER TABLE "Location" DROP CONSTRAINT "FK_d3fbd36fb038c22b0c2c852c636"
        `);
    await queryRunner.query(`
            ALTER TABLE "User" DROP CONSTRAINT "FK_775147058c769ea57efe923d288"
        `);
    await queryRunner.query(`
            ALTER TABLE "User" DROP CONSTRAINT "FK_57e82579dc42b2a7e332d47b2fb"
        `);
    await queryRunner.query(`
            ALTER TABLE "Customer" DROP CONSTRAINT "FK_8171a61aa570303df5ba3ba8d37"
        `);
    await queryRunner.query(`
            ALTER TABLE "Forgot" DROP CONSTRAINT "FK_e748f84f8974537d8ef198d661b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ff3831b17779b3aa1e2f51ca50"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_78c0f439caaae08089d0405264"
        `);
    await queryRunner.query(`
            DROP TABLE "Topic_of_Book"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a8057e34852fe1a3f422e04656"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a516ec022159f434923f8209f7"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_dde618087261cdf6072ba2169a"
        `);
    await queryRunner.query(`
            DROP TABLE "Book"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e4174c535992fe14b0b1f588cf"
        `);
    await queryRunner.query(`
            DROP TABLE "Image"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_966409202478432786fdf607ea"
        `);
    await queryRunner.query(`
            DROP TABLE "Keyword"
        `);
    await queryRunner.query(`
            DROP TABLE "Topic"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_409bc9fd2ae130114c2e098a93"
        `);
    await queryRunner.query(`
            DROP TABLE "Language"
        `);
    await queryRunner.query(`
            DROP TABLE "Status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9eaca0d487c79c671de2e53606"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_24b77135d0ceb5b544b8c614d8"
        `);
    await queryRunner.query(`
            DROP TABLE "Store"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d3fbd36fb038c22b0c2c852c63"
        `);
    await queryRunner.query(`
            DROP TABLE "Location"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_cefd410393729bb8436c91bede"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4a257d2c9837248d70640b3e36"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_775147058c769ea57efe923d28"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_57e82579dc42b2a7e332d47b2f"
        `);
    await queryRunner.query(`
            DROP TABLE "User"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0a75a9ec86ce60aa15a196577f"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8171a61aa570303df5ba3ba8d3"
        `);
    await queryRunner.query(`
            DROP TABLE "Customer"
        `);
    await queryRunner.query(`
            DROP TABLE "User_Type"
        `);
    await queryRunner.query(`
            DROP TABLE "Role"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_c4770d66a9d43e7af538f615da"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e748f84f8974537d8ef198d661"
        `);
    await queryRunner.query(`
            DROP TABLE "Forgot"
        `);
  }
}
