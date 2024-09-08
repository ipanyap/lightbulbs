/**
 * The database connection configuration.
 */
export interface IDatabaseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
}

/**
 * The environment configuration.
 */
export interface IEnvironmentConfig {
  db: IDatabaseConfig;
}

/**
 * The common database client type.
 */
export interface IDatabaseClient {
  /**
   * Initiate database connection.
   */
  connect: () => Promise<void>;
  /**
   * Close database connection.
   */
  disconnect: () => Promise<void>;
  /**
   * Retrieve the connection status.
   * @returns Whether client is connected to database.
   */
  isConnected: () => boolean;
}
