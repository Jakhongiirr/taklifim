import { MigrationInterface, QueryRunner } from 'typeorm';

export class VenuePin1792261161313 implements MigrationInterface {
  name = 'VenuePin1792261161313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "latitude" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "longitude" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "longitude"`);
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "latitude"`);
  }
}
