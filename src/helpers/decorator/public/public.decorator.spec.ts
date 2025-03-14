import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Controller, Get } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC, Public } from './public.decorator';

@Controller('test')
class TestController {
  @Public()
  @Get('public')
  publicEndpoint() {
    return { message: 'Public route' };
  }

  @Get('private')
  privateEndpoint() {
    return { message: 'Private route' };
  }
}

describe('Public Decorator (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
      providers: [Reflector],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow access to public endpoint', () => {
    return request(app.getHttpServer())
      .get('/test/public')
      .expect(200)
      .expect({ message: 'Public route' });
  });

  it('should allow access to private endpoint', () => {
    return request(app.getHttpServer())
      .get('/test/private')
      .expect(200)
      .expect({ message: 'Private route' });
  });
});

describe('Public Decorator', () => {
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [Reflector],
    }).compile();

    reflector = moduleRef.get<Reflector>(Reflector);
  });

  it('should retrieve "public" metadata correctly for decorated method', () => {
    class TestClass {
      @Public()
      testMethod() {}
    }

    const metadata = reflector.get(IS_PUBLIC, TestClass.prototype.testMethod);
    expect(metadata).toBe(true);
  });

  it('should return undefined for method without "public" metadata', () => {
    class TestClass {
      testMethod() {}
    }

    const metadata = reflector.get(IS_PUBLIC, TestClass.prototype.testMethod);
    expect(metadata).toBeUndefined();
  });
});
