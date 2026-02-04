import { downAll, upAll } from 'docker-compose';
import path from 'path';

const directory = path.resolve(__dirname, '..');

export async function mochaGlobalSetup() {
  try {
    console.log(`[Global Setup] Starting up test servers...`);

    // Start up all docker containers
    await upAll({
      cwd: directory,
      log: true,
      executable: {
        standalone: true, // due to bug in v1 of the library
      },
    });

    console.log(`[Global Setup] Test servers are now online!`);
  } catch (e) {
    console.error(e);
  }
}

export async function mochaGlobalTeardown() {
  try {
    console.log(`[Global Teardown] Shutting down test servers...`);

    // Stop all docker containers
    await downAll({
      cwd: directory,
      log: true,
      executable: {
        standalone: true,
      },
      commandOptions: ['--volumes', '--remove-orphans'], // clean up storage after container is down
    });

    console.log(`[Global Teardown] Test servers are now offline!`);
  } catch (e) {
    console.error(e);
  }
}
