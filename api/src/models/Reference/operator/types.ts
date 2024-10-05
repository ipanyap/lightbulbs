import { IDatabaseOperator, IDatabaseOperatorClass } from '../../common/operator/types';
import { IReference, IReferenceData, IReferenceFilter } from '../types';

/**
 * The common instance type for Reference data operators.
 */
export type IReferenceOperator = IDatabaseOperator<IReferenceData>;

/**
 * The common class type for Reference data operators.
 */
export type IReferenceOperatorClass = IDatabaseOperatorClass<IReference, IReferenceData, IReferenceFilter>;
