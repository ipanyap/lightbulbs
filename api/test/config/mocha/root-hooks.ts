import chai from 'chai';
import subset from 'chai-subset';
import mongoose from 'mongoose';

/**
 * Set up root-level hooks
 */
export const mochaHooks = {
  beforeAll: [
    async function openDatabaseConnection() {
      await mongoose.connect(`mongodb://127.0.0.1:27018/test`);
    },
    async function setupChaiPlugins() {
      chai.use(subset);
    },
  ],
  afterAll: [
    async function closeDatabaseConnection() {
      await mongoose.disconnect();
    },
  ],
};
