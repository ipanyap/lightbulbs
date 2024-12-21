import { IDatabaseOperator, IDatabaseOperatorClass } from '../../Entity/operator/types';
import { ITag, ITagData, ITagFilter } from '../types';

/**
 * The common instance type for Tag data operators.
 */
export type ITagOperator = IDatabaseOperator<ITagData>;

/**
 * The common class type for Tag data operators.
 */
export type ITagOperatorClass = IDatabaseOperatorClass<ITag, ITagData, ITagFilter>;
