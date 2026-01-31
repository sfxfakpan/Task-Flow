import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { UserModule } from '../user/user.module';

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
        }),
        forwardRef(() => UserModule)
    ],
    providers: [JwtStrategy, AuthService, BcryptProvider],
    exports: [JwtModule, PassportModule, AuthService, BcryptProvider],
    controllers: [AuthController]
})
export class AuthModule {}
