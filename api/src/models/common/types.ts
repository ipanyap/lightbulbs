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
