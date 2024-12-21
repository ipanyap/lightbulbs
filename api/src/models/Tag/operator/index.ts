import { MongoDBTagOperator } from './mongoose';
import { ITagOperatorClass } from './types';

/**
 * Class that handles database operations involving Tag model.
 * @note It is an alias currently resolves to {@link MongoDBTagOperator}.
 */
export const TagOperator: ITagOperatorClass = MongoDBTagOperator;
