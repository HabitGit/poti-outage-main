import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1690213271552 implements MigrationInterface {
    name = 'Migration1690213271552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9e924dfc993229954cf4a85c403"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9e924dfc993229954cf4a85c403" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9e924dfc993229954cf4a85c403"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9e924dfc993229954cf4a85c403" FOREIGN KEY ("streetId") REFERENCES "streets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
