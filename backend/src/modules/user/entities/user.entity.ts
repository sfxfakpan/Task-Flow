import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Board } from "../../board/entities/board.entity";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "varchar"
    })
    firstName: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    lastName: string;
    
    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @Column({
        nullable: false
    })
    @Exclude()
    password: string;

    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @OneToMany(() => Board, (board) => board.owner)
    boards?: Board[]
}