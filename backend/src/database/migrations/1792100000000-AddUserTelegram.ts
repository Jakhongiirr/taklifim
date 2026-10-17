import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTelegram1792100000000 implements MigrationInterface {
  name = 'AddUserTelegram1792100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "telegramId" bigint`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "locale" character varying(2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "locale"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "telegramId"`);
  }
}
