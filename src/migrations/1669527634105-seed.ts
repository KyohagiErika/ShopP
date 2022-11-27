import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1669527634105 implements MigrationInterface {
    name = 'seed1669527634105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`star\` int NOT NULL, \`feedback\` varchar(255) NOT NULL, \`likes\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`orderProductId\` varchar(36) NULL, UNIQUE INDEX \`REL_63da277d65cb3b23a598a128e5\` (\`orderProductId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`evaluation_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`localFileId\` int NULL, \`evaluationId\` int NULL, UNIQUE INDEX \`REL_df77f5950996f96d3c49046590\` (\`localFileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`deliveryStatus\` \`deliveryStatus\` enum ('0', '1', '2', '3', '4', '5', '6') NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`evaluation\` ADD CONSTRAINT \`FK_63da277d65cb3b23a598a128e51\` FOREIGN KEY (\`orderProductId\`) REFERENCES \`order_product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evaluation_image\` ADD CONSTRAINT \`FK_df77f5950996f96d3c490465907\` FOREIGN KEY (\`localFileId\`) REFERENCES \`local_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`evaluation_image\` ADD CONSTRAINT \`FK_499c78af0afe4781b6f3a1ccdd8\` FOREIGN KEY (\`evaluationId\`) REFERENCES \`evaluation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`evaluation_image\` DROP FOREIGN KEY \`FK_499c78af0afe4781b6f3a1ccdd8\``);
        await queryRunner.query(`ALTER TABLE \`evaluation_image\` DROP FOREIGN KEY \`FK_df77f5950996f96d3c490465907\``);
        await queryRunner.query(`ALTER TABLE \`evaluation\` DROP FOREIGN KEY \`FK_63da277d65cb3b23a598a128e51\``);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`deliveryStatus\` \`deliveryStatus\` enum ('CHECKING', 'CONFIRMED', 'PACKAGING', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'CHECKING'`);
        await queryRunner.query(`DROP INDEX \`REL_df77f5950996f96d3c49046590\` ON \`evaluation_image\``);
        await queryRunner.query(`DROP TABLE \`evaluation_image\``);
        await queryRunner.query(`DROP INDEX \`REL_63da277d65cb3b23a598a128e5\` ON \`evaluation\``);
        await queryRunner.query(`DROP TABLE \`evaluation\``);
    }

}
