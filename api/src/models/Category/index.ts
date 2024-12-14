import { Entity } from '../Entity';
import { ModelStatus } from '../Entity/types';
import { CategoryOperator } from './operator';
import { ICategoryOperator } from './operator/types';
import { ICategoryData, ICategory } from './types';

/**
 * Class that models a category and its related functionalities.
 */
export class Category extends Entity<ICategoryData> {
  /**
   * Create a category model instance.
   * @param input The data to initialize the model. If not provided, the data will be null.
   */
  constructor(input?: ICategory) {
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
   * Edit the data in the `Category` model. The change is not saved until `.save()` is called.
   * @param input The category data to be changed.
   * @returns Reference to `this` model instance.
   */
  public setData(input: Partial<ICategory>): Category {
    // The function to set the data.
    const edit_function = (data: ICategoryData | null): ICategoryData => {
      if (!data) {
        /**
         * Model instance has no data: initialize with the given input.
         */

        // Assert that the input is sufficient to initialize the model's data.
        assertCategory(input);

        // Provide default attributes
        const default_attributes = {
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
  public increaseTotalBulbs(): Category {
    // The function to increment total bulbs.
    const increment_function = (data: ICategoryData | null, status: ModelStatus): ICategoryData => {
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
  public decreaseTotalBulbs(): Category {
    // The function to decrement total bulbs.
    const decrement_function = (data: ICategoryData | null, status: ModelStatus): ICategoryData => {
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
   * Provides a new database operator instance for category model.
   * @param input Either a record ID if loading existing category data, or primary category data if inserting new record.
   * @returns Promise that resolves to the new category operator instance.
   */
  protected async createOperator(input: string | ICategoryData): Promise<ICategoryOperator> {
    if (typeof input === 'string') {
      return await CategoryOperator.retrieveOne({ id: input });
    } else {
      return await CategoryOperator.create({ data: input });
    }
  }
}

/**
 * Function to assert whether an object contains valid category data.
 * @param input The object to assert.
 * @throws Type assertion exception.
 */
function assertCategory(input: Partial<ICategory>): asserts input is ICategory {
  if (!input.name) {
    throw Error('Provided input is not a complete category type!');
  }
}
