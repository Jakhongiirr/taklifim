import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTaklifMusicOptional1791462912348 implements MigrationInterface {
  name = 'MakeTaklifMusicOptional1791462912348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP CONSTRAINT "FK_41f8c7f90bbe2bfe52c036b670b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ALTER COLUMN "musicId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD CONSTRAINT "FK_41f8c7f90bbe2bfe52c036b670b" FOREIGN KEY ("musicId") REFERENCES "music"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif" DROP CONSTRAINT "FK_41f8c7f90bbe2bfe52c036b670b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ALTER COLUMN "musicId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD CONSTRAINT "FK_41f8c7f90bbe2bfe52c036b670b" FOREIGN KEY ("musicId") REFERENCES "music"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
