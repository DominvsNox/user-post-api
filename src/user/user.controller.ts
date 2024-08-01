import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/enums/role.enum';
import { Post as PostEntity } from 'src/post/post.entity';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/add-post')
  addPost(@Param('id') id: number, @Body() createdPost: PostEntity) {
    return this.userService.addPost(id, createdPost);
  }

  @Post('')
  create(@Body() createUserDto: User) {
    createUserDto.role = Role.User;
    return this.userService.create(createUserDto);
  }

  @Post('create-admin')
  createAdmin(@Body() createUserDto: User) {
    createUserDto.role = Role.Admin;
    return this.userService.createAdmin(createUserDto);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUser: User) {
    return this.userService.update(id, updateUser);
  }

  @Patch(':id/update-post/:postId')
  updatePost(@Param('id') id: number, @Param('postId') postId: number, @Body() postToEdit: PostEntity) {
    return this.userService.editPost(id, postId, postToEdit);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Delete(':id/delete-post/:postId')
  removeUsersPost(@Param('id') id: number, @Param('postId') postId: number) {
    return 'remove users post'
  }

  @Get(':id/all-posts')
  findAllUsersPosts(@Param('id') id: number) {
    return this.userService.findAllUserPosts(id);
  }

  @Get('all-posts')
  findAllPosts() {
    return this.userService.findAllPosts();
  }

}
