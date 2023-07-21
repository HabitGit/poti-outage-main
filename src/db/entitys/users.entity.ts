import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Streets } from './streets.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'numeric',
    unique: true,
    nullable: false,
  })
  chatId: number;

  @Column({
    type: 'numeric',
    unique: true,
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  mailing: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Streets, (street) => street.id)
  street: Streets;
}
