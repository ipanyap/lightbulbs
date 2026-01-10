import { IBaseEntityData, IEntityData } from '../types';

/**
 * The common instance type for all database operators.
 */
export interface IDatabaseOperator<EntityType extends IBaseEntityData> {
  /**
   * Retrieve DB record identifier of the data.
   * @returns The DB record ID of the data.
   */
  getID: () => string;
  /**
   * Retrieve the current local data.
   * @returns The data in JavaScript object.
   */
  getData: () => EntityType;
  /**
   * Refresh the local data to reflect the latest record in DB.
   * @note This allows the operator object to refresh itself so the caller would not need to
   * create new operator instance just to reload the data.
   */
  refresh: () => Promise<void>;
  /**
   * Update the local data and store into DB record.
   * @param input.data Set of data attributes to update.
   */
  update: (input: { data: Partial<EntityType> }) => Promise<void>;
  /**
   * Delete the record in DB.
   */
  delete: () => Promise<void>;
}

/**
 * The common class type for all database operators.
 */
export interface IDatabaseOperatorClass<DataType, EntityType extends IEntityData<DataType>, FilterType = {}> {
  /**
   * @static
   * Insert a new record into database and create an operator object to access it.
   * @param input.data The inserted data.
   * @returns The operator object.
   */
  create: (input: { data: EntityType }) => Promise<IDatabaseOperator<EntityType>>;
  /**
   * @static
   * Retrieve existing record from database and create an operator object to access it.
   * @param input.id The DB record identifier of the data.
   * @returns The operator object.
   */
  retrieveOne: (input: { id: string }) => Promise<IDatabaseOperator<EntityType>>;
  /**
   * @static
   * Find all records in database matching specified filter and return their requested fields.
   * @param input.filter Filters to search the matching data.
   * @param input.fields Array of field names to include in the results. By default all fields are included.
   * @returns Array of the requested records.
   */
  findAll: (input?: { filter?: FilterType; fields?: Array<keyof DataType> }) => Promise<Array<Partial<EntityType>>>;
}
