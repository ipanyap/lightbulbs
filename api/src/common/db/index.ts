import { getEnvConfig } from '../env';
import { IDatabaseClient } from '../types';
import { MongoDBClient } from './mongoose';

/**
 * The global database object.
 */
let database: IDatabaseClient | null = null;

/**
 * Initializes database client if needed, and returns the client.
 * @returns The database client
 */
export function getDatabaseClient(): IDatabaseClient {
  if (database === null) {
    const config = getEnvConfig().db;

    database = new MongoDBClient(config);
  }

  return database;
}
