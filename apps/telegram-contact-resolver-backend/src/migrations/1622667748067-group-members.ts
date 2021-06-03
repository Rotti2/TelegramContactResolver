import {MigrationInterface, QueryRunner} from "typeorm";

export class groupMembers1622667748067 implements MigrationInterface {
    name = 'groupMembers1622667748067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `group_member` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `groupId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_event` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `cronExpression` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_event_entry` (`id` int NOT NULL AUTO_INCREMENT, `date` date NOT NULL, `groupEventId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group_event_leaders_telegram_user` (`groupEventId` int NOT NULL, `telegramUserId` int NOT NULL, INDEX `IDX_11ab9598f5240f61eef93da22e` (`groupEventId`), INDEX `IDX_18c1b484e3f248a469884f86dc` (`telegramUserId`), PRIMARY KEY (`groupEventId`, `telegramUserId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `group_member` ADD CONSTRAINT `FK_44c8964c097cf7f71434d6d1122` FOREIGN KEY (`groupId`) REFERENCES `group_event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_event_entry` ADD CONSTRAINT `FK_02fc4c0ad2c6ec3e10c91d953ee` FOREIGN KEY (`groupEventId`) REFERENCES `group_event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_event_leaders_telegram_user` ADD CONSTRAINT `FK_11ab9598f5240f61eef93da22e8` FOREIGN KEY (`groupEventId`) REFERENCES `group_event`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_event_leaders_telegram_user` ADD CONSTRAINT `FK_18c1b484e3f248a469884f86dce` FOREIGN KEY (`telegramUserId`) REFERENCES `telegram_user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group_event_leaders_telegram_user` DROP FOREIGN KEY `FK_18c1b484e3f248a469884f86dce`");
        await queryRunner.query("ALTER TABLE `group_event_leaders_telegram_user` DROP FOREIGN KEY `FK_11ab9598f5240f61eef93da22e8`");
        await queryRunner.query("ALTER TABLE `group_event_entry` DROP FOREIGN KEY `FK_02fc4c0ad2c6ec3e10c91d953ee`");
        await queryRunner.query("ALTER TABLE `group_member` DROP FOREIGN KEY `FK_44c8964c097cf7f71434d6d1122`");
        await queryRunner.query("DROP INDEX `IDX_18c1b484e3f248a469884f86dc` ON `group_event_leaders_telegram_user`");
        await queryRunner.query("DROP INDEX `IDX_11ab9598f5240f61eef93da22e` ON `group_event_leaders_telegram_user`");
        await queryRunner.query("DROP TABLE `group_event_leaders_telegram_user`");
        await queryRunner.query("DROP TABLE `group_event_entry`");
        await queryRunner.query("DROP TABLE `group_event`");
        await queryRunner.query("DROP TABLE `group_member`");
    }

}
