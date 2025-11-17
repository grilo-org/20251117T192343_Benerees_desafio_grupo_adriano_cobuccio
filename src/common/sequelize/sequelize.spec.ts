import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { databaseProvider } from './provider/sequelize.provider';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

jest.mock('sequelize-typescript', () => {
    const mockModel = class Model {
        static belongsTo = jest.fn();
        static hasMany = jest.fn();
    };

    const noopDecorator = () => () => {};

    return {
        Model: mockModel,
        Sequelize: jest.fn().mockImplementation(() => ({
            addModels: jest.fn(),
            sync: jest.fn().mockResolvedValue(true),
            query: jest.fn().mockResolvedValue(true),
        })),
        DataType: {
            INTEGER: jest.fn(),
            STRING: (length?: number) => `STRING(${length})`,
            DATE: jest.fn(),
        },
        Column: noopDecorator,
        Table: noopDecorator,
        ForeignKey: noopDecorator,
        BelongsTo: noopDecorator,
        HasMany: noopDecorator,
        BelongsToMany: noopDecorator,
    };
});

jest.mock('../models/user.model', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('../models/transaction.model', () => ({
    Transaction: {
        findByPk: jest.fn(),
        create: jest.fn(),
    },
}));

describe('Database Providers', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });
    let sequelizeInstance;

    it('should provide a Sequelize instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [...databaseProvider],
        }).compile();

        sequelizeInstance = module.get('SEQUELIZE');

        expect(sequelizeInstance).toBeDefined();
        expect(Sequelize).toHaveBeenCalledWith({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: 'postgres',
            dialectOptions: {
                ssl: false,
            },
            pool: {
                max: 90,
                min: 0,
                acquire: 120000,
                idle: 3000,
            },
            logging: false,
        });
    });

    it('should provide a Sequelize instance with ssl', async () => {
        process.env.PG_CERTIFICATE = 'true';

        const module: TestingModule = await Test.createTestingModule({
            providers: [...databaseProvider],
        }).compile();

        sequelizeInstance = module.get('SEQUELIZE');

        expect(sequelizeInstance).toBeDefined();
        expect(Sequelize).toHaveBeenCalledWith({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: 'postgres',
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false,
                    require: true,
                },
            },
            pool: {
                max: 90,
                min: 0,
                acquire: 120000,
                idle: 3000,
            },
            logging: false,
        });
    });

    it('should call addModels with all models', async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [...databaseProvider],
        }).compile();

        sequelizeInstance = module.get('SEQUELIZE');

        expect(sequelizeInstance.addModels).toHaveBeenCalled();
    });

    it('should call sync method', async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [...databaseProvider],
        }).compile();

        sequelizeInstance = module.get('SEQUELIZE');

        expect(sequelizeInstance.sync).toHaveBeenCalled();
    });

    it('should handle error when sync fails inside provider', async () => {
        const loggerErrorSpy = jest
            .spyOn(Logger.prototype, 'error')
            .mockImplementation(() => {});
        const syncError = new Error('Database sync failed');

        (Sequelize as unknown as jest.Mock).mockImplementation(() => ({
            addModels: jest.fn(),
            sync: jest.fn().mockRejectedValue(syncError),
            query: jest.fn().mockResolvedValue(true),
        }));

        await Test.createTestingModule({
            providers: [...databaseProvider],
        }).compile();

        expect(loggerErrorSpy).toHaveBeenCalledWith(syncError);

        loggerErrorSpy.mockRestore();
    });
});
