import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'src/utils/helperFunctions';
import { Repository } from 'typeorm';
import { UserDataDto } from '../src/dto/user.dto';
import { Organisation, User } from '../src/model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
  ) {}

  async findOneById(id: string): Promise<UserDataDto> {
    const user = await this.userRepository.findOne({
      where: {
        userId: id,
      },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone'],
    });

    return {
      status: 'success',
      message: 'User found',
      data: user,
    };
  }

  async getOrganisations(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['organisations'],
    });

    if (!user || user.organisations.length === 0) {
      throw new UnauthorizedException(
        'User does not have access to any organisations',
      );
    }

    return {
      status: 'success',
      message: 'Organisations found',
      data: {
        organisations: user
          ? user.organisations.map((userOrg) => {
              return {
                orgId: userOrg.orgId,
                name: userOrg.name,
                description: userOrg.description,
              };
            })
          : [],
      },
    };
  }

  async getOrganisationsById(orgId: string, userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['organisations'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const organisation = user.organisations.find((org) => org.orgId === orgId);

    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }

    return {
      status: 'success',
      message: 'Organisation found',
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    };
  }

  async createOrganisation(
    userId: string,
    name: string,
    description: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['organisations'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newOrganisation = this.organisationRepository.create({
      name,
      description,
      users: [user],
    });

    await this.organisationRepository.save(newOrganisation);

    user.organisations.push(newOrganisation);
    await this.userRepository.save(user);

    const {
      orgId,
      name: orgName,
      description: orgDescription,
    } = newOrganisation;

    return {
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: orgId,
        name: orgName,
        description: orgDescription,
      },
    };
  }

  async addUserToOrganisation(orgId: string, userId: string): Promise<any> {
    // return Unprocessable Content when the orgId is not a valid UUID

    if (!isUUID(orgId)) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: 'Invalid organisation ID',
      });
    }

    if (!isUUID(userId)) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: 'Invalid user ID',
      });
    }

    const organisation = await this.organisationRepository.findOne({
      where: { orgId },
      relations: ['users'],
    });

    if (!organisation) {
      throw new UnprocessableEntityException({
        status: 'error',
        message: 'Organisation not found',
      });
    }

    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new UnprocessableEntityException({
        status: 'error',
        messsage: 'User not found',
      });
    }

    organisation.users.push(user);
    await this.organisationRepository.save(organisation);

    return {
      status: 'success',
      message: 'User added to organisation successfully',
    };
  }
}
