import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /employees should create', async () => {
    const res = await request(app.getHttpServer())
      .post('/employees')
      .send({
        email: 'sarah.connor@corp.local',
        firstName: 'Sarah',
        lastName: 'Connor',
        department: 'Security'
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
  });
});
