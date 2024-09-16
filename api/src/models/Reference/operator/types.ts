import { IReference, IReferenceData, IReferenceFilter } from '../types';

/**
 * The common instance type for Reference data operators.
 */
export interface IReferenceOperator {
  /**
   * Retrieve identifier of `Reference` record data.
   * @returns The `Reference` record ID.
   */
  getID: () => string;
  /**
   * Retrieve `Reference` record data.
   * @returns The data in plain-old JavaScript object (POJO).
   */
  getData: () => IReferenceData;
  /**
   * Refresh `Reference` data to reflect the latest record.
   * @note This allows the operator object to refresh itself so the caller would not need to
   * create new operator instance just to reload the data.
   */
  refresh: () => Promise<void>;
  /**
   * Update and store `Reference` record.
   * @param input.data Set of `Reference` attributes to update.
   */
  update: (input: { data: Partial<IReferenceData> }) => Promise<void>;
  /**
   * Delete `Category` record.
   */
  delete: () => Promise<void>;
}

/**
 * The common class type for Reference data operators.
 */
export interface IReferenceOperatorClass {
  /**
   * @static
   * Insert a new `Reference` record and create a `ReferenceOperator` object to access it.
   * @param input.data The new `Reference`'s attributes.
   * @returns The `ReferenceOperator` object.
   */
  create: (input: { data: IReferenceData }) => Promise<IReferenceOperator>;
  /**
   * @static
   * Retrieve existing `Reference` record and create a `ReferenceOperator` object to access it.
   * @param input.id The record identifier of the `Reference` data.
   * @returns The `ReferenceOperator` object.
   */
  retrieveOne: (input: { id: string }) => Promise<IReferenceOperator>;
  /**
   * @static
   * Find all `Reference` records matching specified filter and return their requested fields.
   * @param input.filter.name Filter to search all data whose name contains the specified string.
   * @param input.filter.type Filter to search all data whose type matches the specified type.
   * @param input.filter.locator Filter to search all data whose locator contains the specified string.
   * @param input.filter.description Filter to search all data whose description contains the specified string.
   * @param input.fields Array of field names to include in the results. By default all fields are included.
   * @returns Array of objects containing the `Reference` data.
   */
  findAll: (input?: {
    filter?: IReferenceFilter;
    fields?: Array<keyof IReference>;
  }) => Promise<Array<Partial<IReferenceData>>>;
}
