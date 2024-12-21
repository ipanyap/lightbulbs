import { Types } from 'mongoose';
import { ITagData } from '../../types';

/**
 * The raw `Tag` data format for MongoDB implementation.
 */
export type IRawTagData = Omit<ITagData, 'parent_id'> & { parent_id: Types.ObjectId | null };
