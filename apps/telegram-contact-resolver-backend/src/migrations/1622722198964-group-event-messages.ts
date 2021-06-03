import {MigrationInterface, QueryRunner} from "typeorm";

export class groupEventMessages1622722198964 implements MigrationInterface {
    name = 'groupEventMessages1622722198964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `group_event_entry_message` (`id` int NOT NULL AUTO_INCREMENT, `chatId` int NOT NULL, `messageId` int NOT NULL, `entryId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `group_event_entry` DROP COLUMN `telegramMessageIds`");
        await queryRunner.query("ALTER TABLE `group_event_entry_message` ADD CONSTRAINT `FK_5f8cebdc7eee6bbc678aa685c99` FOREIGN KEY (`entryId`) REFERENCES `group_event_entry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group_event_entry_message` DROP FOREIGN KEY `FK_5f8cebdc7eee6bbc678aa685c99`");
        await queryRunner.query("ALTER TABLE `group_event_entry` ADD `telegramMessageIds` text NOT NULL");
        await queryRunner.query("DROP TABLE `group_event_entry_message`");
    }

}
