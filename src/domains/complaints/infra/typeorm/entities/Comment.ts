import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@domains/users/infra/typeorm/entities/User';
import Agency from '@domains/users/infra/typeorm/entities/Agency';
import Complaint from './Complaint';

@Entity('comments')
class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  complaint_id!: string;

  @ManyToOne(() => Complaint, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'complaint_id' })
  complaint!: Complaint;

  @Column()
  user_id!: string;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  agency_id!: string;

  @ManyToOne(() => Agency, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agency_id' })
  agency!: Agency;

  @Column()
  content!: string;

  @Column('timestamp with time zone')
  date!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default Comment;
