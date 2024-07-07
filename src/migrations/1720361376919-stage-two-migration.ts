import { MigrationInterface, QueryRunner } from "typeorm";

export class StageTwoMigration1720361376919 implements MigrationInterface {
    name = 'StageTwoMigration1720361376919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "PK_f5d85c08048555270e56065f217"`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "PK_b2080e0b8761ffcc8d52d56bcc2" PRIMARY KEY ("orgId")`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP CONSTRAINT "FK_64dc6ab8e007bc0dcd697ce9c2f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_d72ea127f30e21753c9e229891e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP CONSTRAINT "PK_c04fabccbfb936a08a52dfa9976"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD CONSTRAINT "PK_de4f26e66929772274e1ee0c292" PRIMARY KEY ("orgId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64dc6ab8e007bc0dcd697ce9c2"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP CONSTRAINT "PK_de4f26e66929772274e1ee0c292"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD CONSTRAINT "PK_c04fabccbfb936a08a52dfa9976" PRIMARY KEY ("orgId", "userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_64dc6ab8e007bc0dcd697ce9c2" ON "user_organisation" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD CONSTRAINT "FK_64dc6ab8e007bc0dcd697ce9c2f" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP CONSTRAINT "FK_64dc6ab8e007bc0dcd697ce9c2f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64dc6ab8e007bc0dcd697ce9c2"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP CONSTRAINT "PK_c04fabccbfb936a08a52dfa9976"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD CONSTRAINT "PK_de4f26e66929772274e1ee0c292" PRIMARY KEY ("orgId")`);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_64dc6ab8e007bc0dcd697ce9c2" ON "user_organisation" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_organisation" DROP CONSTRAINT "PK_de4f26e66929772274e1ee0c292"`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD CONSTRAINT "PK_c04fabccbfb936a08a52dfa9976" PRIMARY KEY ("orgId", "userId")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_d72ea127f30e21753c9e229891e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_d72ea127f30e21753c9e229891e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_organisation" ADD CONSTRAINT "FK_64dc6ab8e007bc0dcd697ce9c2f" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "PK_b2080e0b8761ffcc8d52d56bcc2"`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "PK_f5d85c08048555270e56065f217" PRIMARY KEY ("id", "orgId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
    }

}
