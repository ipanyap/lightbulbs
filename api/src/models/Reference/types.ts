import { IContextStatistics, IEntityData } from '../Entity/types';

/**
 * The type of the reference.
 */
export enum ReferenceType {
  /**
   * 'PRINT' means the reference comes from printed media e.g. books.
   */
  PRINT = 'Print',
  /**
   * 'WEBPAGE' means the reference comes from online pages or articles.
   */
  WEBPAGE = 'Web Page',
  /**
   * 'IMAGE' means the reference comes from graphical media e.g. images, drawings, paintings.
   */
  IMAGE = 'Image',
  /**
   * 'VIDEO' means the reference comes from video sources: clips, movies, animations, etc.
   */
  VIDEO = 'Video',
  /**
   * 'AUDIO' means the reference comes from recorded sounds (not including music).
   */
  AUDIO = 'Audio',
  /**
   * 'MUSIC' means the reference comes from musical sources such as songs.
   */
  MUSIC = 'Music',
  /**
   * 'SOFTWARE' means the reference comes from computer programs or applications.
   */
  SOFTWARE = 'Software',
  /**
   * 'BULB' means the reference comes from another bulb from the same database.
   */
  BULB = 'Bulb',
}

/**
 * List of available reference types.
 */
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

/**
 * Available string values for reference type.
 */
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
