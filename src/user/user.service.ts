import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/post/post.entity';
import { Role } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly PostRepository: Repository<Post>,
  ) {}

  async hashPwd(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(User: User): Promise<User | undefined> {
    const userExists = await this.findUserByName(User.name);
            if (userExists) throw new BadRequestException('This user already exists!');
    User.password = await this.hashPwd(User.password);
    User.role === Role.Admin ? User.role = Role.Admin : User.role = Role.User;
    return await this.UserRepository.save(User);
  }

  findAll() {
    return this.UserRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  async findUserByName(username: string) {
    return this.UserRepository.findOneBy({ name: username });
  }

  findOne(id: number) {
    return this.UserRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        posts: true,
      },
    });
  }

  async update(id: number, User: User, session) {
    if(id != session.uid && session.userRole === Role.User) throw new BadRequestException('Wrong user!');
    return await this.UserRepository.update(id, User);
  }

  remove(id: number) {
    return this.UserRepository.delete({ id });
  }

  async addPost(id: number, post: Post, session) {
    if(id != session.uid && session.userRole === Role.User) throw new BadRequestException('Wrong user!');
    let user = await this.UserRepository.findOneBy({ id });
    let newPost = new Post();
    newPost.text = post.text;
    newPost.user = user;
    return await this.PostRepository.save(newPost);
  }

  async editPost(id: number, postId: number, post: Post, session) {
    if(id != session.uid && session.userRole === Role.User) throw new BadRequestException('Wrong user!');
    let user = await this.UserRepository.findOneBy({ id });
    let editedPost = new Post();
    editedPost.text = post.text;
    editedPost.id = postId;
    return await this.PostRepository.update(postId, editedPost);
  }

  async deletePost(id: number, postId: number, session) {
    if(id != session.uid && session.userRole === Role.User) throw new BadRequestException('Wrong user!');
    const user = await this.UserRepository.findOneBy({ id });
    if (user) {
      return await this.PostRepository.delete(postId);
    } else {
      return new BadRequestException('User not found');
    }
  }

  findAllPosts() {
    return this.PostRepository.find();
  }

  async findAllUserPosts(id: number) {
    const user = await this.findOne(id);
    if (user) {
      return await this.PostRepository.find({
          relations: {
            user: true,
          },
          where: {
            user: user
        },
      });
    }
  }
}
