import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation, User } from './model/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let organisationRepository: Repository<Organisation>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Organisation),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    organisationRepository = module.get<Repository<Organisation>>(
      getRepositoryToken(Organisation),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('LoginUser', () => {
    it('should generate a token with correct user details and expiration', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        userId: '123',
        firstName: 'Test',
        lastName: 'User',
        email,
        phone: '1234567890',
        password: 'hashedPassword',
      };

      const mockToken = 'testToken';
      const mockExpiresIn = '1h'; // Mock expiration time
      const mockPayload = { sub: user.userId, email: user.email };

      // Mock the signAsync method with a function that verifies the payload and options
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation(async (payload, options) => {
          expect(payload).toEqual(mockPayload);
          if (options) {
            expect(options.expiresIn).toBe(mockExpiresIn);
          } else {
            throw new Error('Options object is undefined');
          }
          return mockToken;
        });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest.spyOn(service, 'validateUser').mockResolvedValue(user as any);

      const result = await service.LoginUser({ email, password });

      expect(result).toEqual({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: mockToken,
          user: {
            userId: '123',
            firstName: 'Test',
            lastName: 'User',
            email,
            phone: '1234567890',
          },
        },
      });

      // Verify that the signAsync method was called with the correct payload and options
      expect(jwtService.signAsync).toHaveBeenCalledWith(mockPayload, {
        expiresIn: mockExpiresIn,
      });
    });
  });
});
