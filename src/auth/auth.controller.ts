import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() regData: User): Promise<User | undefined> {
        return this.authService.registration(regData);
    }

    @Post('login')
    login(@Body() user: User) {
        return this.authService.loginUser(user);
    }
}
