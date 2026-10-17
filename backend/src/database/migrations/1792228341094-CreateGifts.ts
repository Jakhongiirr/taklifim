import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGifts1792228341094 implements MigrationInterface {
  name = 'CreateGifts1792228341094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "orderId" uuid, "taklifId" uuid, "usedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_54242922934e1f322861d116af7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6aea58d0a9f98925db3475b8bb" ON "gifts" ("userId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bb514386ecd9c5bc14cd0750e4" ON "gifts" ("orderId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "gifts" ADD CONSTRAINT "FK_6aea58d0a9f98925db3475b8bb3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gifts" ADD CONSTRAINT "FK_bb514386ecd9c5bc14cd0750e4f" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gifts" ADD CONSTRAINT "FK_1097d87b33dca2da788b31ce344" FOREIGN KEY ("taklifId") REFERENCES "taklif"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gifts" DROP CONSTRAINT "FK_1097d87b33dca2da788b31ce344"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gifts" DROP CONSTRAINT "FK_bb514386ecd9c5bc14cd0750e4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gifts" DROP CONSTRAINT "FK_6aea58d0a9f98925db3475b8bb3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bb514386ecd9c5bc14cd0750e4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6aea58d0a9f98925db3475b8bb"`,
    );
    await queryRunner.query(`DROP TABLE "gifts"`);
  }
}
