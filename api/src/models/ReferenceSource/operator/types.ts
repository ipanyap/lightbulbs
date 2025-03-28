import { IDatabaseOperator, IDatabaseOperatorClass } from '../../Entity/operator/types';
import { IReferenceSource, IReferenceSourceData, IReferenceSourceFilter } from '../types';

/**
 * The common instance type for ReferenceSource data operators.
 */
export type IReferenceSourceOperator = IDatabaseOperator<IReferenceSourceData>;

/**
 * The common class type for ReferenceSource data operators.
 */
export type IReferenceSourceOperatorClass = IDatabaseOperatorClass<
  IReferenceSource,
  IReferenceSourceData,
  IReferenceSourceFilter
>;
