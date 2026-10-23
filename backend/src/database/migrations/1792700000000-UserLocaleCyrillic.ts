import { MigrationInterface, QueryRunner } from 'typeorm';

/** Room for "uz-Cyrl" (Uzbek in Cyrillic) in the user's locale. */
export class UserLocaleCyrillic1792700000000 implements MigrationInterface {
  name = 'UserLocaleCyrillic1792700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "locale" TYPE character varying(8)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "users" SET "locale" = 'uz' WHERE "locale" = 'uz-Cyrl'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "locale" TYPE character varying(2)`,
    );
  }
}
