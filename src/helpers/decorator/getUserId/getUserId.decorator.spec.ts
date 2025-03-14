import { Test } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserIdToken } from './getUserId.decorator';

@Injectable()
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer valid_token')) {
      request.user = { sub: 1234 };
      return true;
    }
    throw new UnauthorizedException();
  }
}

describe('GetUserIdToken Decorator (e2e)', () => {
  let app: INestApplication;

  @Controller('user')
  class UserController {
    @UseGuards(MockAuthGuard)
    @Get('id')
    getUserId(@GetUserIdToken() userId: string) {
      return { userId };
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [MockAuthGuard],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return user ID from token', () => {
    return request(app.getHttpServer())
      .get('/user/id')
      .set('Authorization', 'Bearer valid_token')
      .expect(200)
      .expect({ userId: 1234 });
  });

  it('should return 401 if token is invalid', () => {
    return request(app.getHttpServer()).get('/user/id').expect(401);
  });
});
