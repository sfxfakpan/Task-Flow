import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAndBoards1769774885286 implements MigrationInterface {
    name = 'CreateUsersAndBoards1769774885286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id")`);
    }

}
