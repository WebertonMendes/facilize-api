import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity('tb_users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'boolean', default: true })
  is_active?: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
