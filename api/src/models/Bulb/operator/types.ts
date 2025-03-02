import { IDatabaseOperator, IDatabaseOperatorClass } from '../../Entity/operator/types';
import { IBulb, IBulbData, IBulbFilter } from '../types';

/**
 * The common instance type for Bulb data operators.
 */
export type IBulbOperator = IDatabaseOperator<IBulbData>;

/**
 * The common class type for Bulb data operators.
 */
export type IBulbOperatorClass = IDatabaseOperatorClass<IBulb, IBulbData, IBulbFilter>;
