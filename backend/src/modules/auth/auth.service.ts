import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { User } from "../user/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { BcryptProvider } from "./providers/bcrypt.provider";
import { UserService } from "../user/user.service";


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private bcryptProvider: BcryptProvider,
  ){}

  async signUp(createUser: RegisterDto) {
    const user = await this.userService.createNewUser(createUser)
    try{
      const access_token = await this.generateToken(user)
      return {
        access_token,
        user
      }
    }catch(err){
      throw new InternalServerErrorException(err)
    }
  }

  async login(loginDto: LoginDto){
    const user = await this.userService.findByEmail(loginDto.email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.bcryptProvider.verifyPassword(loginDto.password, user.password)
    if(!isPasswordValid){
      throw new UnauthorizedException('Invalid credentials')
    }
    const { password, ...userData } = user;
    const access_token = await this.generateToken(userData)
    return {
      access_token,
      user: userData
    }
  }

  async generateToken(user: Partial<User>){
    const payload = {
      sub: user.id,
      email: user.email
    }
    return await this.jwtService.signAsync(payload)
  }

  getProfile(id: string){
    return this.userService.findByid(id)
  }
}
