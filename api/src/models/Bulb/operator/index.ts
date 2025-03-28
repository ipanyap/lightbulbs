import { MongoDBBulbOperator } from './mongoose';
import { IBulbOperatorClass } from './types';

/**
 * Class that handles database operations involving Bulb model.
 * @note It is an alias currently resolves to {@link MongoDBBulbOperator}.
 */
export const BulbOperator: IBulbOperatorClass = MongoDBBulbOperator;
