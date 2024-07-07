import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../src/user.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should successfully register a user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'Password123!',
          phone: '1234567890',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'success');
          expect(res.body).toHaveProperty('message', 'Registration successful');
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.user).toEqual({
            userId: expect.any(String),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
          });
        });
    });

    it('should return a validation error for missing fields', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: '',
          lastName: '',
          email: 'invalid-email',
          password: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('firstName should not be empty');
          expect(res.body.message).toContain('lastName should not be empty');
          expect(res.body.message).toContain('email must be an email');
          expect(res.body.message).toContain('password should not be empty');
        });
    });

    it('should return an error if the user already exists', async () => {
      // Register a user first
      await request(app.getHttpServer()).post('/auth/register').send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123!',
        phone: '0987654321',
      });

      // Try to register the same user again
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          password: 'Password123!',
          phone: '0987654321',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    it('should return a validation error for invalid email format', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice.smith@invalid',
          password: 'Password123!',
          phone: '1234567890',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('should return a validation error for invalid password format', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Bob',
          lastName: 'Brown',
          email: 'bob.brown@example.com',
          password: '123',
          phone: '1234567890',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain(
            'password must be at least 6 characters',
          );
        });
    });

    it('should return a validation error for invalid phone number format', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          firstName: 'Charlie',
          lastName: 'Davis',
          email: 'charlie.davis@example.com',
          password: 'Password123!',
          phone: 'invalid-phone',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain(
            'phone must be a valid phone number',
          );
        });
    });
  });
});
