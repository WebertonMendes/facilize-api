import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TasksTable1667920805901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'tb_tasks',
          columns: [
            {
              name: 'id',
              type: 'varchar',
              isPrimary: true,
              generationStrategy: 'uuid',
            },
            {
              name: 'description',
              type: 'varchar',
            },
            {
              name: 'user_id',
              type: 'varchar',
            },
            {
              name: 'attachment',
              type: 'boolean',
              default: false,
            },
            {
              name: 'category_id',
              type: 'numeric',
              isNullable: true,
              default: null,
            },
            {
              name: 'is_finished',
              type: 'boolean',
              default: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
          foreignKeys: [
            {
              name: 'fk_task_user',
              referencedColumnNames: ['id'],
              referencedTableName: 'tb_users',
              columnNames: ['user_id'],
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('tb_tasks');
    }
}
