import { runSeedUsers } from './seed_users';

export async function runSeeds() {
    await runSeedUsers();
}
