import { IDatabaseOperator, IDatabaseOperatorClass } from '../../common/operator/types';
import { ICategory, ICategoryData, ICategoryFilter } from '../types';

/**
 * The common instance type for Category data operators.
 */
export type ICategoryOperator = IDatabaseOperator<ICategoryData>;

/**
 * The common class type for Category data operators.
 */
export type ICategoryOperatorClass = IDatabaseOperatorClass<ICategory, ICategoryData, ICategoryFilter>;
