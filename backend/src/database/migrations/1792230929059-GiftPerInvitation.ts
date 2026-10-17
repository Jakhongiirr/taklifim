import { MigrationInterface, QueryRunner } from 'typeorm';

export class GiftPerInvitation1792230929059 implements MigrationInterface {
  name = 'GiftPerInvitation1792230929059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gifts" ADD "sourceTaklifId" uuid`);
    // Gifts so far came with paid orders: their invitations.
    await queryRunner.query(
      `UPDATE "gifts" g SET "sourceTaklifId" = o."taklifId" FROM "orders" o WHERE g."orderId" = o."id"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1f1885f2c72bb53e28989b84a0" ON "gifts" ("sourceTaklifId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "gifts" ADD CONSTRAINT "FK_1f1885f2c72bb53e28989b84a07" FOREIGN KEY ("sourceTaklifId") REFERENCES "taklif"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gifts" DROP CONSTRAINT "FK_1f1885f2c72bb53e28989b84a07"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f1885f2c72bb53e28989b84a0"`,
    );
    await queryRunner.query(`ALTER TABLE "gifts" DROP COLUMN "sourceTaklifId"`);
  }
}
