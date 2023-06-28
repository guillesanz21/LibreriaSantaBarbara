import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1687884195847 implements MigrationInterface {
  name = 'CreateTables1687884195847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "Store" (
                "id" SERIAL NOT NULL,
                "is_admin" boolean NOT NULL DEFAULT false,
                "email" text NOT NULL,
                "password" text NOT NULL,
                "approved" boolean NOT NULL DEFAULT false,
                "name" text NOT NULL,
                "NIF" text,
                "address" text,
                "phone_number" text NOT NULL,
                "hash" text,
                "last_activity" date NOT NULL DEFAULT now(),
                "created_at" date NOT NULL DEFAULT now(),
                "updated_at" date DEFAULT now(),
                "deleted_at" date,
                CONSTRAINT "UQ_2d4b489e686ed3dd1ad2acb5f03" UNIQUE ("email"),
                CONSTRAINT "UQ_9eaca0d487c79c671de2e536066" UNIQUE ("name"),
                CONSTRAINT "UQ_8b8dd14b60ab45a5863f26e4cf2" UNIQUE ("NIF"),
                CONSTRAINT "PK_f20e3845680debc547e49355a89" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_2d4b489e686ed3dd1ad2acb5f0" ON "Store" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_9eaca0d487c79c671de2e53606" ON "Store" ("name")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_944eca6651844bae297b62481e" ON "Store" ("hash")
        `);
    await queryRunner.query(`
            CREATE TABLE "Location" (
                "id" SERIAL NOT NULL,
                "location" text NOT NULL,
                CONSTRAINT "UQ_09e70ef7d6ccdc4c32fa163c07f" UNIQUE ("location"),
                CONSTRAINT "PK_d0125e359cde2707aec388b9c59" PRIMARY KEY ("id")
            )
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
                "language" text NOT NULL,
                "book_id" integer NOT NULL,
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
                "keyword" text NOT NULL,
                "book_id" integer NOT NULL,
                CONSTRAINT "PK_c4ad165a78a72334ec6be8734bd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_966409202478432786fdf607ea" ON "Keyword" ("book_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Image" (
                "id" SERIAL NOT NULL,
                "url" text NOT NULL,
                "book_id" integer NOT NULL,
                CONSTRAINT "PK_ddecd6b02f6dd0d3d10a0a74717" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e4174c535992fe14b0b1f588cf" ON "Image" ("book_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "Book" (
                "id" SERIAL NOT NULL,
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
                "price" numeric NOT NULL,
                "stock" integer DEFAULT '1',
                "binding" text,
                "private_note" text,
                "created_at" date NOT NULL DEFAULT now(),
                "sold_at" date,
                "store_id" integer NOT NULL,
                "location_id" integer,
                "status_id" integer NOT NULL,
                CONSTRAINT "UQ_3113aa5430d58f3be4fcffc86a2" UNIQUE ("store_id", "ref"),
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
            CREATE TABLE "Customer" (
                "id" SERIAL NOT NULL,
                "is_admin" boolean NOT NULL DEFAULT false,
                "email" text NOT NULL,
                "password" text,
                "provider" character varying NOT NULL DEFAULT 'email',
                "social_id" text,
                "first_name" text,
                "last_name" text,
                "DNI" text,
                "address" text,
                "phone_number" text,
                "hash" text,
                "email_confirmed" boolean NOT NULL DEFAULT false,
                "created_at" date NOT NULL DEFAULT now(),
                "updated_at" date DEFAULT now(),
                "deleted_at" date,
                CONSTRAINT "UQ_9cfb4c775b9158522c466ef8d60" UNIQUE ("email"),
                CONSTRAINT "UQ_846a5cdb371a1e8fe34248aafa8" UNIQUE ("DNI"),
                CONSTRAINT "PK_60596e16740e1fa20dbf0154ec7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_9cfb4c775b9158522c466ef8d6" ON "Customer" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0a75a9ec86ce60aa15a196577f" ON "Customer" ("social_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_846a5cdb371a1e8fe34248aafa" ON "Customer" ("DNI")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6d820c5f383258256f1654071d" ON "Customer" ("hash")
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
            ADD CONSTRAINT "FK_78c0f439caaae08089d04052648" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "Topic_of_Book"
            ADD CONSTRAINT "FK_ff3831b17779b3aa1e2f51ca505" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            DROP INDEX "public"."IDX_ff3831b17779b3aa1e2f51ca50"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_78c0f439caaae08089d0405264"
        `);
    await queryRunner.query(`
            DROP TABLE "Topic_of_Book"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6d820c5f383258256f1654071d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_846a5cdb371a1e8fe34248aafa"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0a75a9ec86ce60aa15a196577f"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9cfb4c775b9158522c466ef8d6"
        `);
    await queryRunner.query(`
            DROP TABLE "Customer"
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
            DROP TABLE "Location"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_944eca6651844bae297b62481e"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9eaca0d487c79c671de2e53606"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2d4b489e686ed3dd1ad2acb5f0"
        `);
    await queryRunner.query(`
            DROP TABLE "Store"
        `);
  }
}
