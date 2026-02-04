import { IEntityData } from '../Entity/types';

/**
 * The primary `Bulb` data.
 */
export interface IBulb {
  title: string;
  category: {
    id: string;
  };
  content: string;
  references: Array<{
    source: {
      id: string;
    };
    detail: string | null;
  }>;
  tags: Array<{ id: string }>;
  past_versions: Array<{
    archived_at: Date;
    content: string;
  }>;
}

/**
 * The complete `Bulb` data as stored in database.
 */
export type IBulbData = IEntityData<IBulb>;

/**
 * The filter type for `Bulb` search.
 * @todo this has limitations and cannot cover filtering operators beside string contains.
 */
export type IBulbFilter = Partial<
  Pick<IBulbData, 'title' | 'content'> & {
    categories: Array<string>;
    references: Array<string>;
    tags: Array<string>;
  }
>;
