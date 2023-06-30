import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "numeric",
        unique: true,
        nullable: false,
    })
    chatId: number

    @Column({
        type: "numeric",
        unique: true,
        nullable: false,
    })
    userId: number
}