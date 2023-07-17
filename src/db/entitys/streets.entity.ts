import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Streets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  nameGeo: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  nameRu: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  nameEng: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Users, (users) => users.id)
  users: Users[];
}
