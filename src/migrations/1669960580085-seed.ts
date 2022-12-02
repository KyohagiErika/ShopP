import { MigrationInterface, QueryRunner } from 'typeorm';

export class seed1669960580085 implements MigrationInterface {
  name = 'seed1669960580085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`event_product\` (\`id\` varchar(36) NOT NULL, \`discount\` double NOT NULL DEFAULT '0', \`amount\` int NOT NULL, \`sold\` int NOT NULL DEFAULT '0', \`status\` enum ('ACTIVE', 'INACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE', \`eventId\` int NULL, \`productId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`discount\``);
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`deliveryStatus\` \`deliveryStatus\` enum ('CHECKING', 'CONFIRMED', 'PACKAGING', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'CHECKING'`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_product\` ADD CONSTRAINT \`FK_d41cbc4f9dcf90586f2e37f0fba\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_product\` ADD CONSTRAINT \`FK_304dcd4c3b15110a3136afaa03f\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event_product\` DROP FOREIGN KEY \`FK_304dcd4c3b15110a3136afaa03f\``
    );
    await queryRunner.query(
      `ALTER TABLE \`event_product\` DROP FOREIGN KEY \`FK_d41cbc4f9dcf90586f2e37f0fba\``
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`deliveryStatus\` \`deliveryStatus\` enum ('0', '1', '2', '3', '4', '5', '6') NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`discount\` double NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(`DROP TABLE \`event_product\``);
  }
}
