import { MongoDBReferenceOperator } from './mongoose';
import { IReferenceOperatorClass } from './types';

/**
 * Class that handles database operations involving Reference model.
 * @note It is an alias currently resolves to {@link MongoDBReferenceOperator}.
 */
export const ReferenceOperator: IReferenceOperatorClass = MongoDBReferenceOperator;
