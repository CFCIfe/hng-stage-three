import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FailureDto,
  RegisterUserDto,
  SuccessDto,
  UserLoginDto,
} from './dto/user.dto';
import { Organisation, User } from './model/user.entity';
import {
  hashPassword,
  isPasswordMatch,
  toTitleCase,
} from './utils/helperFunctions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,

    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const isMatch = await isPasswordMatch(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findByPayload(payload: any): Promise<any> {
    return await this.userRepository.findOne({
      where: { email: payload.email },
    });
  }

  async RegisterUser(
    RegisterUser: RegisterUserDto,
  ): Promise<SuccessDto | FailureDto> {
    try {
      const { firstName, lastName, email, password, phone } = RegisterUser;

      // Check user does not exist
      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists) {
        throw new BadRequestException({
          status: 'Bad request',
          message: 'User already exists',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const userObj = {
        firstName,
        lastName,
        email,
        password: await hashPassword(password),
        phone,
      };

      const user = this.userRepository.create(userObj);

      // Create Organisation
      const orgObj = {
        name: `${toTitleCase(firstName)}'s Organisation'`,
        description: `An organisation for ${toTitleCase(firstName + ' ' + lastName)}`,
      };

      const organisation = this.organisationRepository.create(orgObj);

      organisation.users = [user];

      await this.userRepository.save(user);
      await this.organisationRepository.save(organisation);

      const { userId } = user;

      const accessToken = await this.jwtService.signAsync(
        {
          sub: userId,
          username: userObj.email,
        },
        {
          expiresIn: '1h',
        },
      );

      return {
        status: 'success',
        message: 'Registration successful',
        data: {
          accessToken,
          user: {
            userId,
            firstName,
            lastName,
            email,
            phone,
          },
        },
      };
    } catch (e) {
      throw new BadRequestException({
        status: 'Bad request',
        message: 'Registration unsuccessful',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async LoginUser(LoginUser: UserLoginDto): Promise<any> {
    const { email, password } = LoginUser;

    const user = await this.validateUser(email, password);

    const { userId, firstName, lastName, phone } = user;

    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '1h',
      },
    );

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          userId,
          firstName,
          lastName,
          email,
          phone,
        },
      },
    };
  }
}
