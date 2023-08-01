import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690571204335 implements MigrationInterface {
    name = 'Migration1690571204335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9e924dfc993229954cf4a85c403"`);
        await queryRunner.query(`CREATE TABLE "users_streets_streets" ("usersId" integer NOT NULL, "streetsId" integer NOT NULL, CONSTRAINT "PK_5bfc6be1ea59a60dd28ff27b9d3" PRIMARY KEY ("usersId", "streetsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e5770d4d907fbecba1cd8fe8af" ON "users_streets_streets" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c889eb9d6f8cda06d39a42832" ON "users_streets_streets" ("streetsId") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "streetId"`);
        await queryRunner.query(`ALTER TABLE "users_streets_streets" ADD CONSTRAINT "FK_e5770d4d907fbecba1cd8fe8af3" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_streets_streets" ADD CONSTRAINT "FK_9c889eb9d6f8cda06d39a428327" FOREIGN KEY ("streetsId") REFERENCES "streets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_streets_streets" DROP CONSTRAINT "FK_9c889eb9d6f8cda06d39a428327"`);
        await queryRunner.query(`ALTER TABLE "users_streets_streets" DROP CONSTRAINT "FK_e5770d4d907fbecba1cd8fe8af3"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "streetId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c889eb9d6f8cda06d39a42832"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5770d4d907fbecba1cd8fe8af"`);
        await queryRunner.query(`DROP TABLE "users_streets_streets"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9e924dfc993229954cf4a85c403" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
