import {MigrationInterface, QueryRunner} from "typeorm";

export class groupEvents1622719135352 implements MigrationInterface {
    name = 'groupEvents1622719135352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `group_event_entry_visited_group_members_group_member` (`groupEventEntryId` int NOT NULL, `groupMemberId` int NOT NULL, INDEX `IDX_c874623dc35845a2d749a45efd` (`groupEventEntryId`), INDEX `IDX_881185ad098661f501dce9051c` (`groupMemberId`), PRIMARY KEY (`groupEventEntryId`, `groupMemberId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `group_event_entry` ADD `telegramMessageIds` text NOT NULL");
        await queryRunner.query("ALTER TABLE `group_event_entry_visited_group_members_group_member` ADD CONSTRAINT `FK_c874623dc35845a2d749a45efdd` FOREIGN KEY (`groupEventEntryId`) REFERENCES `group_event_entry`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `group_event_entry_visited_group_members_group_member` ADD CONSTRAINT `FK_881185ad098661f501dce9051c1` FOREIGN KEY (`groupMemberId`) REFERENCES `group_member`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `group_event_entry_visited_group_members_group_member` DROP FOREIGN KEY `FK_881185ad098661f501dce9051c1`");
        await queryRunner.query("ALTER TABLE `group_event_entry_visited_group_members_group_member` DROP FOREIGN KEY `FK_c874623dc35845a2d749a45efdd`");
        await queryRunner.query("ALTER TABLE `group_event_entry` DROP COLUMN `telegramMessageIds`");
        await queryRunner.query("DROP INDEX `IDX_881185ad098661f501dce9051c` ON `group_event_entry_visited_group_members_group_member`");
        await queryRunner.query("DROP INDEX `IDX_c874623dc35845a2d749a45efd` ON `group_event_entry_visited_group_members_group_member`");
        await queryRunner.query("DROP TABLE `group_event_entry_visited_group_members_group_member`");
    }

}
