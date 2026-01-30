import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter a valid email address"})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
