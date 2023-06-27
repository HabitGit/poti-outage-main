import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687861877974 implements MigrationInterface {
    name = 'Migration1687861877974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "chatId" numeric NOT NULL, "userId" numeric NOT NULL, CONSTRAINT "UQ_096d474fe7c1af7be4726762505" UNIQUE ("chatId"), CONSTRAINT "UQ_8bf09ba754322ab9c22a215c919" UNIQUE ("userId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
