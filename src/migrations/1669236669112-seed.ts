import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1669236669112 implements MigrationInterface {
    name = 'seed1669236669112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` ADD \`shopId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_318cc4bdeb61d336e3a01f4b767\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_318cc4bdeb61d336e3a01f4b767\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`shopId\``);
    }

}
