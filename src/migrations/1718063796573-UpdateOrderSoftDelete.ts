import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderSoftDelete1718063796573 implements MigrationInterface {
    name = 'UpdateOrderSoftDelete1718063796573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "shipping" SET DEFAULT '49.99'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "shipping" SET DEFAULT 49.99`);
    }

}
