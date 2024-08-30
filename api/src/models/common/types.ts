/**
 * The status of the entity's model.
 */
export enum ModelStatus {
  /**
   * 'EMPTY' means the model contains no data at all.
   */
  EMPTY = 'EMPTY',
  /**
   * 'PRISTINE' means the data in the model has not been edited by user since last time it's being synced with the database.
   */
  PRISTINE = 'PRISTINE',
  /**
   * 'DIRTY' means the data in the model has been edited by user and not yet saved to the database.
   */
  DIRTY = 'DIRTY',
}

/**
 * The common data for all entities stored in database.
 */
export interface IEntityData {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

/**
 * The statistical metadata for bulb's context entities.
 */
export interface IContextStatistics {
  total_bulbs: number;
}
