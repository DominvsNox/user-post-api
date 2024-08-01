import { User } from "../user/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'post'})
export class Post {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'text'})
    text: string;

    @ManyToOne(()=> User, (user)=> user.posts, {
        onDelete: 'CASCADE'
    })
    user: User;
}