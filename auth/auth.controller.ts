import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { UserDataDto } from '../src/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserDataDto> {
    const userId = req['user'].sub;
    if (userId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return await this.authService.findOneById(userId);
  }

  @Get('/organisations')
  @UseGuards(JwtAuthGuard)
  async getOrganisations(@Req() req: AuthenticatedRequest): Promise<any> {
    const userId = req['user'].sub;
    return await this.authService.getOrganisations(userId);
  }

  @Get('/organisations/:id')
  @UseGuards(JwtAuthGuard)
  async getOrganisationsById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req['user'].sub;
    return await this.authService.getOrganisationsById(id, userId);
  }

  @Post('/organisations')
  @UseGuards(JwtAuthGuard)
  async createOrganisation(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name: string; description: string },
  ): Promise<any> {
    const userId = req['user'].sub;
    const { name, description } = body;

    if (!name) {
      throw new BadRequestException({
        status: 'Bad request',
        message: 'Client error',
        StatusCode: 400,
      });
    }

    return await this.authService.createOrganisation(userId, name, description);
  }

  @Post('/organisations/:orgId/users')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async addUserToOrganisation(
    @Param('orgId') orgId: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    const { userId } = body;

    if (!userId) {
      throw new UnprocessableEntityException({
        status: 'Error',
        message: 'User ID is required',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    return await this.authService.addUserToOrganisation(orgId, userId);
  }
}
