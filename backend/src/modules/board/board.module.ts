import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { Board } from "./entities/board.entity";
import { BoardsController } from "./board.controller";
import { Task } from "../task/entities/task.entity";
import { BoardsService } from "./providers/board.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Board, Task]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [BoardsController],
    providers: [BoardsService],
    exports: [BoardsService],
})
export class BoardModule{}