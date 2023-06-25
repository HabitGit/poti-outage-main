import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "int",
        unique: true,
        nullable: false,
    })
    chatId: number

    @Column({
        type: "int",
        unique: true,
        nullable: false,
    })
    userId: number
}