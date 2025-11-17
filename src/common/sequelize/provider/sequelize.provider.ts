import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { User } from '../../../common/models/user.model';
import { TransactionModel } from '../../../common/models/transaction.model';
import { runSeedUsers } from '../seeds/seed_users';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const logger = new Logger('DatabaseProvider');

export const databaseProvider = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            let SSL;
            if (!process.env.PG_CERTIFICATE) {
                SSL = false;
            } else {
                SSL = {
                    require: true,
                    rejectUnauthorized: false,
                };
            }

            const sequelize = new Sequelize({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                database: process.env.DB_DATABASE,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                dialect: 'postgres',
                dialectOptions: {
                    ssl: SSL,
                },
                pool: {
                    max: 90,
                    min: 0,
                    acquire: 120000,
                    idle: 3000,
                },
                logging: false,
            });
            sequelize.addModels([User, TransactionModel]);

            try {
                await sequelize.sync({ logging: false });
                if (process.env.NODE_ENV !== 'production') {
                    try {
                        await runSeedUsers();
                    } catch (seedErr) {
                        logger.warn(
                            'Seeds não puderam ser executadas: ' +
                                seedErr.message,
                        );
                    }
                }
            } catch (error) {
                logger.error(error);
            }
            return sequelize;
        },
    },
];
