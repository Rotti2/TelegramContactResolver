import {MigrationInterface, QueryRunner} from "typeorm";

export class telegramAdmins1622734917312 implements MigrationInterface {
    name = 'telegramAdmins1622734917312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `telegram_user` ADD `admin` tinyint NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `telegram_user` DROP COLUMN `admin`");
    }

}
