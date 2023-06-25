import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687552109428 implements MigrationInterface {
    name = 'Migration1687552109428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "test"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_8bf09ba754322ab9c22a215c919" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_096d474fe7c1af7be4726762505" UNIQUE ("chatId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_096d474fe7c1af7be4726762505"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_8bf09ba754322ab9c22a215c919" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "test" character varying NOT NULL`);
    }

}
