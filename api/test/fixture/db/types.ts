import { IBulbData } from '../../../src/models/Bulb/types';
import { ICategoryData } from '../../../src/models/Category/types';
import { IReferenceSourceData } from '../../../src/models/ReferenceSource/types';
import { ITagData } from '../../../src/models/Tag/types';

/**
 * The fixture entities.
 */
export enum FixtureEntityType {
  BULB = 'BULB',
  CATEGORY = 'CATEGORY',
  REFERENCE_SOURCE = 'REFERENCE_SOURCE',
  TAG = 'TAG',
}

/**
 * The complete type of records retrievable from the fixture database.
 */
export interface IPopulatedEntities {
  categories: Array<ICategoryData & { id: string }>;
  reference_sources: Array<IReferenceSourceData & { id: string }>;
  tags: Array<ITagData & { id: string }>;
  bulbs: Array<IBulbData & { id: string }>;
}

/**
 * The common fixture database client type.
 */
export type IFixtureDBClient = {
  /**
   * Initialize and populate the database with prepared test records.
   * @param entities List of fixture entities to populate.
   */
  init: (entities?: Array<FixtureEntityType>) => Promise<void>;
  /**
   * Retrieve the database records currently stored in the client (may be stale).
   * @returns The complete retrieved records.
   */
  records: () => IPopulatedEntities;
  /**
   * Re-synchronize data from the database to the client's local state.
   */
  refresh: () => Promise<void>;
  /**
   * Drop the database and reset the client.
   */
  clear: () => Promise<void>;
};
