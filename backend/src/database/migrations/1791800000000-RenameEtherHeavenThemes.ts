import { MigrationInterface, QueryRunner } from 'typeorm';

const RENAMES = [
  ['ether', 'violet'],
  ['heaven', 'haven'],
] as const;

const title = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

/**
 * Renames the ether and heaven designs to violet and haven (the frontend's
 * theme folders follow), and their demos when still titled after them.
 * Payment records keep the titles they were paid under.
 */
export class RenameEtherHeavenThemes1791800000000 implements MigrationInterface {
  name = 'RenameEtherHeavenThemes1791800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [from, to] of RENAMES) await rename(queryRunner, from, to);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [from, to] of RENAMES) await rename(queryRunner, to, from);
  }
}

async function rename(queryRunner: QueryRunner, from: string, to: string) {
  await queryRunner.query(
    `UPDATE "demos" SET "title" = $1 WHERE "title" = $2 AND "themeId" IN (SELECT "id" FROM "themes" WHERE "themeId" = $3)`,
    [title(to), title(from), from],
  );
  await queryRunner.query(
    `UPDATE "themes" SET "themeId" = $1 WHERE "themeId" = $2`,
    [to, from],
  );
}
