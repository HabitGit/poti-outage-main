import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
