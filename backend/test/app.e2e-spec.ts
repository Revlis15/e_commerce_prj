import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/register (POST) - should register a new customer', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        matKhau: 'password123',
        vaiTro: 'CUSTOMER',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
      });
  });

  it('/auth/login (POST) - should login with valid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'login@example.com',
        matKhau: 'password123',
        vaiTro: 'CUSTOMER',
      });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        matKhau: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  it('/categories (GET) - should return categories list', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/products (GET) - should return products list', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
