import { BadRequestException, Injectable, } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async registration(regData: User): Promise<User | undefined> {
        const userExists = await this.userService.findUserByName(regData.name);
            if (userExists) throw new BadRequestException('This user already registered!');
        return this.userService.create(regData);
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findUserByName(username);
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    async loginUser(loginData: User, session) {
        const user = await this.userService.findUserByName(loginData.name);
        if (!user) throw new BadRequestException('Wrong data');
            const passwordCompare = await bcrypt.compare(loginData.password, user.password);
        if(!passwordCompare) throw new BadRequestException('Wrong data');
            const payload = { sub: user.id, username: user.name, role: user.role };
            session.userRole = user.role;
            if (user.role === Role.User) session.uid = user.id;
        return {
            access_token: await this.jwtService.signAsync(payload),
            ...payload
        };
    }

}
