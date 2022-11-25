import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1669307248284 implements MigrationInterface {
    name = 'seed1669307248284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`discount\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`discount\` double NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`discount\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`discount\` int NOT NULL DEFAULT '0'`);
    }

}
