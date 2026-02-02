import { BadRequestException, ConflictException, Injectable, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { BcryptProvider } from "../auth/providers/bcrypt.provider";
import { RegisterDto } from "../auth/dto/register.dto";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptProvider:BcryptProvider
  ){}

  async createNewUser(createUserDto: RegisterDto) {
    const { password, ...userData } = createUserDto
    const hashedPassword = await this.bcryptProvider.hashUserPassword(password)
    
    try{
      let newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword
      })
      const savedUser: Partial<User> = await this.userRepository.save(newUser)
      delete savedUser.password;
      return savedUser;
    }catch(err){
      if (err.code === '23505' ) {
        throw new ConflictException('Email already exists');
      }
      if (err.code === '23502') {
        throw new BadRequestException(`Missing required field: ${err.column}`);
      }
      throw new RequestTimeoutException(err)
    }
  }

  async findByEmail(email: string) {
    let user = await this.userRepository.findOneBy({email})
    return user
  }

  async findByid(id: string){
    let user = await this.userRepository.findOneBy({id})
    if(!user){
        throw new NotFoundException('User not found')
    };
    return user;
  }

}
