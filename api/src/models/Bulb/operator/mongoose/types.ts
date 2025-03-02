import { Types } from 'mongoose';
import { IBulbData } from '../../types';

/**
 * The raw `Bulb` data format for MongoDB implementation.
 */
export type IRawBulbData = Omit<IBulbData, 'category' | 'references' | 'tags'> & {
  category_id: Types.ObjectId;
  references: Array<{
    source_id: Types.ObjectId;
    detail: string | null;
  }>;
  tag_ids: Array<Types.ObjectId>;
};
