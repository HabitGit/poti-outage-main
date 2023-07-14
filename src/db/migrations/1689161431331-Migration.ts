import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1689161431331 implements MigrationInterface {
  name = 'Migration1689161431331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD "mailing" boolean NOT NULL DEFAULT true',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "mailing"');
  }
}
