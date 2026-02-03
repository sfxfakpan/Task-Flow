import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptProvider{

    async hashUserPassword(password:string){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword;
    }

    async verifyPassword(password:string, hashedPassword: string){
        const isMatch = await bcrypt.compare(password, hashedPassword)
        return isMatch;
    }
}
