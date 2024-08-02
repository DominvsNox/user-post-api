import { Role } from "src/enums/role.enum";
import { Post } from "src/post/post.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @ApiProperty()
    @Column({name: 'name'})
    name: string;

    @ApiProperty()
    @Column({name: 'password'})
    password: string;

    @ApiProperty()
    @Column({name: 'role', default: 'user'})
    role: Role;

    @OneToMany(()=> Post, (post)=>post.user)
    posts: Post[];
}
