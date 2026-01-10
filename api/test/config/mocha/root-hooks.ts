import mongoose from 'mongoose';

/**
 * Set up root-level hooks
 */
export const mochaHooks = {
  beforeAll: [
    async function openDatabaseConnection() {
      await mongoose.connect(`mongodb://127.0.0.1:27018/test`);
    },
  ],
  afterAll: [
    async function closeDatabaseConnection() {
      await mongoose.disconnect();
    },
  ],
};
