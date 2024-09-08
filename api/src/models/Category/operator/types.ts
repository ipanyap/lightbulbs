import { ICategory, ICategoryData, ICategoryFilter } from '../types';

/**
 * The common instance type for Category data operators.
 */
export interface ICategoryOperator {
  /**
   * Retrieve identifier of `Category` record data.
   * @returns The `Category` record ID.
   */
  getID: () => string;
  /**
   * Retrieve `Category` record data.
   * @returns The data in plain-old JavaScript object (POJO).
   */
  getData: () => ICategoryData;
  /**
   * Refresh `Category` data to reflect the latest record.
   * @note This allows the operator object to refresh itself so the caller would not need to
   * create new operator instance just to reload the data.
   */
  refresh: () => Promise<void>;
  /**
   * Update and store `Category` record.
   * @param input.data Set of `Category` attributes to update.
   */
  update: (input: { data: Partial<ICategoryData> }) => Promise<void>;
  /**
   * Delete `Category` record.
   */
  delete: () => Promise<void>;
}

/**
 * The common class type for Category data operators.
 */
export interface ICategoryOperatorClass {
  /**
   * @static
   * Insert a new `Category` record and create a `CategoryOperator` object to access it.
   * @param input.data The new `Category`'s attributes.
   * @returns The `CategoryOperator` object.
   */
  create: (input: { data: ICategoryData }) => Promise<ICategoryOperator>;
  /**
   * @static
   * Retrieve existing `Category` record and create a `CategoryOperator` object to access it.
   * @param input.id The record identifier of the `Category` data.
   * @returns The `CategoryOperator` object.
   */
  retrieveOne: (input: { id: string }) => Promise<ICategoryOperator>;
  /**
   * @static
   * Find all `Category` records matching specified filter and return their requested fields.
   * @param input.filter.name Filter to search all data whose name contains the specified string.
   * @param input.filter.description Filter to search all data whose description contains the specified string.
   * @param input.fields Array of field names to include in the results. By default all fields are included.
   * @returns Array of objects containing the `Category` data.
   */
  findAll: (input?: {
    filter?: ICategoryFilter;
    fields?: Array<keyof ICategory>;
  }) => Promise<Array<Partial<ICategoryData>>>;
}
