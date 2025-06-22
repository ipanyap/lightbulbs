import { IContextStatistics, IEntityData } from '../Entity/types';

/**
 * The type of the reference source.
 */
export enum ReferenceSourceType {
  /**
   * 'PRINT' means the reference source is a printed media e.g. books.
   */
  PRINT = 'Print',
  /**
   * 'WEBPAGE' means the reference source is an online pages or articles.
   */
  WEBPAGE = 'Web Page',
  /**
   * 'IMAGE' means the reference source is a graphical media e.g. images, drawings, paintings.
   */
  IMAGE = 'Image',
  /**
   * 'VIDEO' means the reference source is a video sources: clips, movies, animations, etc.
   */
  VIDEO = 'Video',
  /**
   * 'AUDIO' means the reference source is a recorded sounds (not including music).
   */
  AUDIO = 'Audio',
  /**
   * 'MUSIC' means the reference source is a musical sources such as songs.
   */
  MUSIC = 'Music',
  /**
   * 'SOFTWARE' means the reference source is a computer programs or applications.
   */
  SOFTWARE = 'Software',
  /**
   * 'BULB' means the reference source is another bulb from the same database.
   */
  BULB = 'Bulb',
}

/**
 * List of available reference source types.
 */
export const ReferenceSourceTypes = [
  ReferenceSourceType.PRINT,
  ReferenceSourceType.WEBPAGE,
  ReferenceSourceType.IMAGE,
  ReferenceSourceType.VIDEO,
  ReferenceSourceType.AUDIO,
  ReferenceSourceType.MUSIC,
  ReferenceSourceType.SOFTWARE,
  ReferenceSourceType.BULB,
] as const;

/**
 * The primary `ReferenceSource` data.
 */
export interface IReferenceSource {
  name: string;
  type: ReferenceSourceType;
  locator: string | null;
  image_url: string | null;
  description: string | null;
}

/**
 * The complete `ReferenceSource` data as stored in database.
 */
export type IReferenceSourceData = IEntityData<
  IReferenceSource & {
    statistics: IContextStatistics;
  }
>;

/**
 * The filter type for `ReferenceSource` search.
 * @todo this has limitations and cannot cover filtering operators beside string contains.
 */
export type IReferenceSourceFilter = Partial<Pick<IReferenceSourceData, 'name' | 'type' | 'locator' | 'description'>>;
