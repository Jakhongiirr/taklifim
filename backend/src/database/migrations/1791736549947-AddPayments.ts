import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayments1791736549947 implements MigrationInterface {
  name = 'AddPayments1791736549947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'paid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taklifId" uuid, "userId" uuid, "themeId" uuid, "amount" integer NOT NULL, "title" character varying(250) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "paidAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34c1eefc3b20ac685d0da0a896" ON "orders" ("taklifId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_151b79a83ba240b0cb31b2302d" ON "orders" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders" ("status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "payme_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymeId" character varying(25) NOT NULL, "orderId" uuid NOT NULL, "amount" bigint NOT NULL, "state" smallint NOT NULL, "reason" smallint, "paymeTime" bigint NOT NULL, "createTime" bigint NOT NULL, "performTime" bigint NOT NULL DEFAULT '0', "cancelTime" bigint NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_27760b5e1d6399f11f9d3f6ee40" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a0397d36133e3f3f73b097be44" ON "payme_transactions" ("paymeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9933a2f23379fe94dcd23cf33" ON "payme_transactions" ("orderId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif" ADD "paidAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_34c1eefc3b20ac685d0da0a8965" FOREIGN KEY ("taklifId") REFERENCES "taklif"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_dcea0bdaf4d717b9ed6633484d0" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payme_transactions" ADD CONSTRAINT "FK_a9933a2f23379fe94dcd23cf332" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payme_transactions" DROP CONSTRAINT "FK_a9933a2f23379fe94dcd23cf332"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_dcea0bdaf4d717b9ed6633484d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_34c1eefc3b20ac685d0da0a8965"`,
    );
    await queryRunner.query(`ALTER TABLE "taklif" DROP COLUMN "paidAt"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a9933a2f23379fe94dcd23cf33"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0397d36133e3f3f73b097be44"`,
    );
    await queryRunner.query(`DROP TABLE "payme_transactions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_151b79a83ba240b0cb31b2302d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_34c1eefc3b20ac685d0da0a896"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
  }
}
