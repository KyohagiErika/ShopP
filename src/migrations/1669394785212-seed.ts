import { MigrationInterface, QueryRunner } from 'typeorm';

export class seed1669394785212 implements MigrationInterface {
  name = 'seed1669394785212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`created_at\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`createdAt\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
  }
}
