import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Board } from "../../board/entities/board.entity";
import { Task } from "../../task/entities/task.entity";


@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @OneToMany(() => Board, (board) => board.user)
    boards?: Board[];

    @OneToMany(() => Task, (task) => task.assignee)
    assignedTasks?: Task[];
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    
}