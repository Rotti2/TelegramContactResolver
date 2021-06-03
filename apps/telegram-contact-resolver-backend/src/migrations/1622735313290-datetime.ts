import {MigrationInterface, QueryRunner} from "typeorm";

export class datetime1622735313290 implements MigrationInterface {
    name = 'datetime1622735313290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group_event_entry` DROP COLUMN `date`");
        await queryRunner.query("ALTER TABLE `group_event_entry` ADD `date` datetime NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group_event_entry` DROP COLUMN `date`");
        await queryRunner.query("ALTER TABLE `group_event_entry` ADD `date` date NOT NULL");
    }

}
