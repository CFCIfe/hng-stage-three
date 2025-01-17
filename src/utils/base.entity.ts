import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
