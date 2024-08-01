import { Role } from "src/enums/role.enum";
import { Post } from "src/post/post.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'name'})
    name: string;

    @Column({name: 'password'})
    password: string;

    @Column({name: 'role', default: 'user'})
    role: Role;

    @OneToMany(()=> Post, (post)=>post.user)
    posts: Post[];
}
