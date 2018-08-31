import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  email: string;

  // In PostgreSQL, 'text' allows it to be of any length.
  // NOTE: You can't define the length yourself. Use 'varchar' for that.
  @Column('text')
  password: string;
}
