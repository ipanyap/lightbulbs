import { MongoDBCategoryOperator } from './mongoose';
import { ICategoryOperatorClass } from './types';

/**
 * Class that handles database operations involving Category model.
 * @note It is an alias currently resolves to {@link MongoDBCategoryOperator}
 */
export const CategoryOperator: ICategoryOperatorClass = MongoDBCategoryOperator;
