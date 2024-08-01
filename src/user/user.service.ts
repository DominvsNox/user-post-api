import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/post/post.entity';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly PostRepository: Repository<Post>,
  ) {}

  async create(User: User): Promise<User | undefined> {
    User.role = Role.User;
    return await this.UserRepository.save(User);
  }

  async createAdmin(User: User): Promise<User | undefined> {
    User.role = Role.Admin;
    return await this.UserRepository.save(User);
  }

  findAll() {
    //return this.UserRepository.find();
    return this.UserRepository.find({
        relations: {
            posts: true,
        },
    })
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

  async update(id: number, User: User) {
    return await this.UserRepository.update(id, User);
  }

  remove(id: number) {
    return this.UserRepository.delete({ id });
  }

  async addPost(id: number, post: Post) {
    let user = await this.UserRepository.findOneBy({ id });
    let newPost = new Post();
    //newPost.userId = id;
    newPost.text = post.text;
    newPost.user = user;
    //user.posts.push(newPost);
    await this.PostRepository.save(newPost);
    return await this.UserRepository.save(user);
  }

  async editPost(id: number, postId: number, post: Post) {
    let user = await this.UserRepository.findOneBy({ id });
    let editedPost = new Post();
    //editedPost.userId = user.id;
    editedPost.text = post.text;
    editedPost.id = postId;
    await this.PostRepository.update(postId, editedPost);
    return await this.UserRepository.save(user);
  }

  async deletePost(id: number, postId: number) {
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
        })
    }
  }
}
