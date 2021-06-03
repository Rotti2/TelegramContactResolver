import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1622666770463 implements MigrationInterface {
    name = 'initial1622666770463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `telegram_user` CHANGE `telegramId` `telegramId` int NULL");
        await queryRunner.query("ALTER TABLE `telegram_user` ADD UNIQUE INDEX `IDX_3ba075036043b9d69b2beaf42d` (`telegramId`)");
        await queryRunner.query("ALTER TABLE `telegram_user` CHANGE `chatId` `chatId` int NULL");
        await queryRunner.query("ALTER TABLE `telegram_user` ADD UNIQUE INDEX `IDX_ea5f0c288ae9045e3afa2535a0` (`username`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `telegram_user` DROP INDEX `IDX_ea5f0c288ae9045e3afa2535a0`");
        await queryRunner.query("ALTER TABLE `telegram_user` CHANGE `chatId` `chatId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `telegram_user` DROP INDEX `IDX_3ba075036043b9d69b2beaf42d`");
        await queryRunner.query("ALTER TABLE `telegram_user` CHANGE `telegramId` `telegramId` int NOT NULL");
    }

}
