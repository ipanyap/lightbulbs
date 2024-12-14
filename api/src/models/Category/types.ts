import { IContextStatistics, IEntityData } from '../Entity/types';

/**
 * The primary `Category` data.
 */
export interface ICategory {
  name: string;
  description: string | null;
}

/**
 * The complete `Category` data as stored in database.
 */
export type ICategoryData = IEntityData<
  ICategory & {
    statistics: IContextStatistics;
  }
>;

/**
 * The filter type for `Category` search.
 * @todo this has limitations and cannot cover filtering operators beside string contains.
 */
export type ICategoryFilter = Partial<Pick<ICategoryData, 'name' | 'description'>>;
