import mongoose from 'mongoose';
import { IDatabaseClient, IDatabaseConfig } from '../types';

/**
 * Class that handles connection with MongoDB through mongoose library.
 */
export class MongoDBClient implements IDatabaseClient {
  private is_connected: boolean;
  private config: IDatabaseConfig;

  /**
   * Create a MongoDB client.
   * @param config The config needed to open connection with the MongoDB database.
   */
  constructor(config: IDatabaseConfig) {
    this.is_connected = false;
    this.config = config;

    /**
     * Make commands to fail immediately if not connected to database.
     * @see https://mongoosejs.com/docs/faq.html#callback_never_executes
     */
    mongoose.set('bufferCommands', false);

    // Log any connection failure.
    mongoose.connection.on('error', (error) => {
      console.error(error);
    });

    /**
     * Sync connection status from mongoose.
     */
    mongoose.connection.on('connected', () => {
      this.is_connected = true;
    });

    mongoose.connection.on('disconnected', () => {
      this.is_connected = false;
    });

    mongoose.connection.on('reconnected', () => {
      this.is_connected = true;
    });
  }

  /**
   * Initiate database connection.
   */
  public async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.is_connected) {
      return Promise.resolve();
    }

    const { host, port, database } = this.config;

    try {
      await mongoose.connect(`mongodb://${host}:${port}/${database}`, {
        // Prevent automatically building index (manually decide which index to create)
        autoIndex: false,
        // Connect using IPv4
        family: 4,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Close database connection.
   */
  public async disconnect(): Promise<void> {
    if (this.is_connected) {
      await mongoose.disconnect();
    }
  }

  /**
   * Retrieve the connection status.
   * @returns Whether client is connected to database.
   */
  public isConnected(): boolean {
    return this.is_connected;
  }
}
