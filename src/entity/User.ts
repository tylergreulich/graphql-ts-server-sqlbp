import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity
} from 'typeorm';
import * as uuidv4 from 'uuid/v4';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  email: string;

  // In PostgreSQL, 'text' allows it to be of any length.
  // NOTE: You can't define the length yourself. Use 'varchar' for that.
  @Column('text')
  password: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
