import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { dataSourceOptions } from './config/typeorm';
import { Organisation, User } from './model/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Organisation]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
