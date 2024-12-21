import { IContextStatistics, IEntityData, IHierarchyStatistics } from '../Entity/types';

/**
 * The primary `Tag` data.
 */
export interface ITag {
  label: string;
  parent_id: string | null;
  description: string | null;
}

/**
 * The complete `Tag` data as stored in database.
 */
export type ITagData = IEntityData<
  ITag & {
    statistics: IContextStatistics & IHierarchyStatistics;
  }
>;

/**
 * The filter type for `Tag` search.
 * @todo this has limitations and cannot cover filtering operators beside string contains.
 */
export type ITagFilter = Partial<Pick<ITagData, 'label' | 'parent_id' | 'description'>>;
