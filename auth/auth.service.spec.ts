import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation, User } from '../src/model/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let organisationRepository: Repository<Organisation>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Organisation),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    organisationRepository = module.get<Repository<Organisation>>(
      getRepositoryToken(Organisation),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getOrganisations', () => {
    it('should return organizations the user has access to', async () => {
      const userId = '123';
      const organisations = [
        { orgId: '1', name: 'Org 1', description: 'Description 1' },
        { orgId: '2', name: 'Org 2', description: 'Description 2' },
      ];

      const user = {
        userId,
        organisations,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

      const result = await service.getOrganisations(userId);

      expect(result).toEqual({
        status: 'success',
        message: 'Organisations found',
        data: {
          organisations,
        },
      });
    });

    it('should throw UnauthorizedException if the user does not have access to any organisations', async () => {
      const userId = '123';

      const user = {
        userId,
        organisations: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

      await expect(service.getOrganisations(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
