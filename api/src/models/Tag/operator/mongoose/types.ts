import { Types } from 'mongoose';
import { ITagData } from '../../types';

export type IRawTagData = Omit<ITagData, 'parent_id'> & { parent_id: Types.ObjectId | null };
