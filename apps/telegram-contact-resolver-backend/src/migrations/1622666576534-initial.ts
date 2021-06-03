import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1622666576534 implements MigrationInterface {
    name = 'initial1622666576534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `telegram_user` (`id` int NOT NULL AUTO_INCREMENT, `telegramId` int NOT NULL, `chatId` int NOT NULL, `username` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `telegram_user`");
    }

}
