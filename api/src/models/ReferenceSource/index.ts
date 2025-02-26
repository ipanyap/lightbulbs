import { Entity } from '../Entity';
import { ModelStatus } from '../Entity/types';
import { ReferenceSourceOperator } from './operator';
import { IReferenceSourceOperator } from './operator/types';
import { IReferenceSourceData, IReferenceSource } from './types';

/**
 * Class that models a reference source and its related functionalities.
 */
export class ReferenceSource extends Entity<IReferenceSourceData> {
  /**
   * Create a reference source model instance.
   * @param input The data to initialize the model. If not provided, the data will be null.
   */
  constructor(input?: IReferenceSource) {
    if (input) {
      super({
        ...input,
        statistics: {
          total_bulbs: 0,
        },
      });
    } else {
      super();
    }
  }

  /**
   * Edit the data in the `ReferenceSource` model. The change is not saved until `.save()` is called.
   * @param input The reference source data to be changed.
   * @returns Reference to `this` model instance.
   */
  public setData(input: Partial<IReferenceSource>): ReferenceSource {
    // The function to set the data.
    const edit_function = (data: IReferenceSourceData | null): IReferenceSourceData => {
      if (!data) {
        /**
         * Model instance has no data: initialize with the given input.
         */

        // Assert that the input is sufficient to initialize the model's data.
        assertReferenceSource(input);

        // Provide default attributes
        const default_attributes = {
          locator: null,
          image_url: null,
          description: null,
        };

        return {
          ...default_attributes,
          ...input,
          statistics: {
            total_bulbs: 0,
          },
        };
      } else {
        /**
         * Model instance already has data: merge with the given input.
         */

        return {
          ...data,
          ...input,
        };
      }
    };

    // Pass the editing function to super class for execution.
    super.performEdit(edit_function);

    return this;
  }

  /**
   * Increment the total bulbs statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public increaseTotalBulbs(): ReferenceSource {
    // The function to increment total bulbs.
    const increment_function = (data: IReferenceSourceData | null, status: ModelStatus): IReferenceSourceData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw Error('Cannot increase total bulbs of empty data!');
      }

      data.statistics.total_bulbs++;

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(increment_function);

    return this;
  }

  /**
   * Decrement the total bulbs statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public decreaseTotalBulbs(): ReferenceSource {
    // The function to decrement total bulbs.
    const decrement_function = (data: IReferenceSourceData | null, status: ModelStatus): IReferenceSourceData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw Error('Cannot decrease total bulbs of empty data!');
      }

      // Cannot be performed on zero or negative total.
      if (data.statistics.total_bulbs <= 0) {
        throw Error('Invalid operation: total bulbs has already reached 0');
      }

      data.statistics.total_bulbs--;

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(decrement_function);

    return this;
  }

  /**
   * Provides a new database operator instance for source model.
   * @param input Either a record ID if loading existing reference source data, or primary reference source data if inserting new record.
   * @returns Promise that resolves to the new reference source operator instance.
   */
  protected async createOperator(input: string | IReferenceSourceData): Promise<IReferenceSourceOperator> {
    if (typeof input === 'string') {
      return await ReferenceSourceOperator.retrieveOne({ id: input });
    } else {
      return await ReferenceSourceOperator.create({ data: input });
    }
  }
}

/**
 * Function to assert whether an object contains valid reference source data.
 * @param input The object to assert.
 * @throws Type assertion exception.
 */
function assertReferenceSource(input: Partial<IReferenceSource>): asserts input is IReferenceSource {
  if (!input.name || !input.type) {
    throw Error('The provided input is not a complete reference source type!');
  }
}
