import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1669236678724 implements MigrationInterface {
    name = 'seed1669236678724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`packaged_product_size\` CHANGE \`lenght\` \`length\` int NOT NULL`);
        await queryRunner.query(`CREATE TABLE \`product_events_event\` (\`productId\` varchar(36) NOT NULL, \`eventId\` int NOT NULL, INDEX \`IDX_22fc99d104836c1d11ad8a4a1d\` (\`productId\`), INDEX \`IDX_c359829ff704924892d8fa68b6\` (\`eventId\`), PRIMARY KEY (\`productId\`, \`eventId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`discount\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`product_events_event\` ADD CONSTRAINT \`FK_22fc99d104836c1d11ad8a4a1db\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product_events_event\` ADD CONSTRAINT \`FK_c359829ff704924892d8fa68b66\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_events_event\` DROP FOREIGN KEY \`FK_c359829ff704924892d8fa68b66\``);
        await queryRunner.query(`ALTER TABLE \`product_events_event\` DROP FOREIGN KEY \`FK_22fc99d104836c1d11ad8a4a1db\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`discount\``);
        await queryRunner.query(`DROP INDEX \`IDX_c359829ff704924892d8fa68b6\` ON \`product_events_event\``);
        await queryRunner.query(`DROP INDEX \`IDX_22fc99d104836c1d11ad8a4a1d\` ON \`product_events_event\``);
        await queryRunner.query(`DROP TABLE \`product_events_event\``);
        await queryRunner.query(`ALTER TABLE \`packaged_product_size\` CHANGE \`length\` \`lenght\` int NOT NULL`);
    }

}
