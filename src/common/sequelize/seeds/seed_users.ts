import { Logger } from '@nestjs/common';
import { User } from '../../models/user.model';
import * as bcrypt from 'bcrypt';

export async function runSeedUsers() {
    const logger = new Logger('runSeedUsers');
    logger.log('Iniciando seed de users...');
    const users = [
        {
            name: 'Admin',
            email: 'admin@example.com',
            password: 'adminpass',
            role: 'admin',
            balance: '10000.00',
        },
        {
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
            role: 'user',
        },
        {
            name: 'Bob',
            email: 'bob@example.com',
            password: 'password123',
            role: 'user',
        },
    ];

    for (const u of users) {
        const exists = await User.findOne({ where: { email: u.email } });
        if (!exists) {
            const hashed = await bcrypt.hash(u.password, 10);
            await User.create({
                name: u.name,
                email: u.email,
                password: hashed,
                balance: u.balance ?? '3000.00',
                role: u.role ?? 'user',
            } as User);
        }
    }
    logger.log('Finalizando seed de users');
}
