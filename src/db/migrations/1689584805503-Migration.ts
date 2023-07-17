import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689584805503 implements MigrationInterface {
    name = 'Migration1689584805503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "streets" ("id" SERIAL NOT NULL, "nameGeo" character varying NOT NULL, "nameRu" character varying, "nameEng" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8ec24cbe04111878935f25264b0" UNIQUE ("nameGeo"), CONSTRAINT "PK_e375a3a3ebbc18cf91e72374d94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "streetId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9e924dfc993229954cf4a85c403" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9e924dfc993229954cf4a85c403"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "streetId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "streets"`);
    }

}
