import { MigrationInterface, QueryRunner } from 'typeorm';

export class StageTwoMigration1720343658785 implements MigrationInterface {
  name = 'StageTwoMigration1720343658785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orgId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_b2080e0b8761ffcc8d52d56bcc2" UNIQUE ("orgId"), CONSTRAINT "PK_f5d85c08048555270e56065f217" PRIMARY KEY ("id", "orgId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_organisation" ("orgId" uuid NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_c04fabccbfb936a08a52dfa9976" PRIMARY KEY ("orgId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de4f26e66929772274e1ee0c29" ON "user_organisation" ("orgId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64dc6ab8e007bc0dcd697ce9c2" ON "user_organisation" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organisation" ADD CONSTRAINT "FK_de4f26e66929772274e1ee0c292" FOREIGN KEY ("orgId") REFERENCES "organisation"("orgId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organisation" ADD CONSTRAINT "FK_64dc6ab8e007bc0dcd697ce9c2f" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_organisation" DROP CONSTRAINT "FK_64dc6ab8e007bc0dcd697ce9c2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organisation" DROP CONSTRAINT "FK_de4f26e66929772274e1ee0c292"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64dc6ab8e007bc0dcd697ce9c2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_de4f26e66929772274e1ee0c29"`,
    );
    await queryRunner.query(`DROP TABLE "user_organisation"`);
    await queryRunner.query(`DROP TABLE "organisation"`);
  }
}
