import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";


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
}