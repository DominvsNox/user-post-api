import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/enums/role.enum';
import { Post as PostEntity } from 'src/post/post.entity';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/decorators/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/add-post')
  addPost(@Param('id') id: number, @Body() createdPost: PostEntity, @Session() session) {
    return this.userService.addPost(id, createdPost, session);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @Roles(Role.Admin)
  create(@Body() createUser: User) {
    createUser.role = Role.User;
    return this.userService.create(createUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @Roles(Role.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('one/:id')@Roles(Role.Admin)
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUser: User, @Session() session) {
    return this.userService.update(id, updateUser, session);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/update-post/:postId')
  updatePost(
    @Param('id') id: number,
    @Param('postId') postId: number,
    @Body() postToEdit: PostEntity,
    @Session() session
  ) {
    return this.userService.editPost(id, postId, postToEdit, session);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete-post/:postId')
  removeUsersPost(@Param('id') id: number, @Param('postId') postId: number, @Session() session) {
    return this.userService.deletePost(id, postId, session);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/all-posts')
  findAllUsersPosts(@Param('id') id: number) {
    return this.userService.findAllUserPosts(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-posts')
  @Roles(Role.Admin)
  findAllPosts() {
    return this.userService.findAllPosts();
  }
}
