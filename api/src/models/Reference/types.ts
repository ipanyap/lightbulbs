import { IContextStatistics, IEntityData } from '../common/types';

export enum ReferenceType {
  PRINT = 'Print',
  WEBPAGE = 'Web Page',
  IMAGE = 'Image',
  VIDEO = 'Video',
  AUDIO = 'Audio',
  MUSIC = 'Music',
  SOFTWARE = 'Software',
  BULB = 'Bulb',
}

export const ReferenceTypes = [
  ReferenceType.PRINT,
  ReferenceType.WEBPAGE,
  ReferenceType.IMAGE,
  ReferenceType.VIDEO,
  ReferenceType.AUDIO,
  ReferenceType.MUSIC,
  ReferenceType.SOFTWARE,
  ReferenceType.BULB,
] as const;

export type IReferenceType = (typeof ReferenceTypes)[number];

/**
 * The primary `Reference` data.
 */
export interface IReference {
  name: string;
  type: ReferenceType;
  locator?: string;
  image_url?: string;
  description?: string;
}

/**
 * The complete `Reference` data as stored in database.
 */
export type IReferenceData = IEntityData<
  IReference & {
    statistics: IContextStatistics;
  }
>;

/**
 * The filter type for `Reference` search.
 * @todo this has limitations and cannot cover filtering operators beside string contains.
 */
export type IReferenceFilter = Partial<Pick<IReferenceData, 'name' | 'type' | 'locator' | 'description'>>;
