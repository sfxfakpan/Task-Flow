import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const env = configService.get('app.environment');
                return {
                    global: true,
                    secret: env.jwtSecret,
                    signOptions: { expiresIn: env.jwtExpiresIn }
                }
            }
        })
    ],
    providers: [JwtStrategy, AuthService],
    exports: [JwtModule, PassportModule, AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
