import { IFixtureDBClient } from './types';
import { FixtureMongoDBClient } from './mongoose';

/**
 * The global fixture database object.
 */
let database: IFixtureDBClient | null = null;

/**
 * Initializes fixture database client if needed, and returns the client.
 * @returns The fixture database client.
 */
export function getFixtureDatabaseClient(): IFixtureDBClient {
  if (database === null) {
    database = new FixtureMongoDBClient();
  }

  return database;
}
