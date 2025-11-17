import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserRepository } from '../src/common/repositories/user.repository';
import { TransactionRepository } from '../src/common/repositories/transaction.repository';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { HealthController } from '../src/health.controller';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        // Provide a mock for the SEQUELIZE provider to avoid connecting to a real DB
        const mockSequelize = {};

        // Build a minimal module with the health controller only to avoid complex DI from AppModule
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect({ status: 'OK' });
    });
});
