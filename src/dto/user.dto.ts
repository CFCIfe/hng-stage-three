// "userId": "string" // must be unique
// "firstName": "string", // must not be null
// "lastName": "string" // must not be null
// "email": "string" // must be unique and must not be null
// "password": "string" // must not be null
// "phone": "string"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  'userId': string;
  'firstName': string;
  'lastName': string;
  'email': string;
  'phone': string;
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  phone: string;
}

export class SuccessDto {
  'status': string;
  'message': string;
  'data': {
    accessToken: string;
    user: {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

export class FailureDto {
  'status': string;
  'message': string;
  'statusCode': number;
}

export class UserLoginDto {
  'email': string;
  'password': string;
}

export class UserDataDto {
  'status': string;
  'message': string;
  'data': {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}
