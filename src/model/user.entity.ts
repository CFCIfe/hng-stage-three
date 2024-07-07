import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Base } from '../utils/base.entity';

@Entity({ name: 'user' })
@Unique(['userId'])
@Unique(['email'])
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToMany(() => Organisation, (organisation) => organisation.users)
  organisations: Organisation[];
}

@Entity({ name: 'organisation' })
@Unique(['orgId'])
export class Organisation extends Base {
  @PrimaryGeneratedColumn('uuid')
  orgId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.organisations)
  @JoinTable({
    name: 'user_organisation',
    joinColumn: { name: 'orgId', referencedColumnName: 'orgId' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'userId' },
  })
  users: User[];
}
