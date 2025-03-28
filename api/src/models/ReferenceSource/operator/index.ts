import { MongoDBReferenceSourceOperator } from './mongoose';
import { IReferenceSourceOperatorClass } from './types';

/**
 * Class that handles database operations involving ReferenceSource model.
 * @note It is an alias currently resolves to {@link MongoDBReferenceSourceOperator}.
 */
export const ReferenceSourceOperator: IReferenceSourceOperatorClass = MongoDBReferenceSourceOperator;
