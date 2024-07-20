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
 * The database client type.
 */
export interface IDatabaseClient {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
}
