import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
    imports: [
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
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
    controllers: [AuthController]
})
export class AuthModule {}
