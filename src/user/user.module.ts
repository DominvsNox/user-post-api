import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Post } from 'src/post/post.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Post])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
