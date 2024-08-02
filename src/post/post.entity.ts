import { User } from "../user/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'post'})
export class Post {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @ApiProperty()
    @Column({name: 'text'})
    text: string;

    @ManyToOne(()=> User, (user)=> user.posts, {
        onDelete: 'CASCADE'
    })
    user: User;
}