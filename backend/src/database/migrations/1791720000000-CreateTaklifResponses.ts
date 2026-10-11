import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaklifResponses1791720000000 implements MigrationInterface {
  name = 'CreateTaklifResponses1791720000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "taklif_responses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taklifId" uuid NOT NULL, "name" character varying(60) NOT NULL, "attending" boolean NOT NULL, "guests" smallint NOT NULL DEFAULT '1', "message" character varying(500), "likedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b59d533e0aa05aa63ba441e5a75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56783c5db2740d3a6469cedd98" ON "taklif_responses" ("taklifId", "createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "taklif_responses" ADD CONSTRAINT "FK_04aa23487c097e6c549d38ed953" FOREIGN KEY ("taklifId") REFERENCES "taklif"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taklif_responses" DROP CONSTRAINT "FK_04aa23487c097e6c549d38ed953"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56783c5db2740d3a6469cedd98"`,
    );
    await queryRunner.query(`DROP TABLE "taklif_responses"`);
  }
}
