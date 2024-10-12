import { Entity } from '../Entity';
import { ModelStatus } from '../Entity/types';
import { ReferenceOperator } from './operator';
import { IReferenceOperator } from './operator/types';
import { IReferenceData, IReference } from './types';

/**
 * Class that models a reference and its related functionalities.
 */
export class Reference extends Entity<IReferenceData> {
  private operator: IReferenceOperator | null;

  /**
   * Create a reference model instance.
   * @param input The data to initialize the model. If not provided, the data will be null.
   */
  constructor(input?: IReference) {
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

    this.operator = null;
  }

  /**
   * Reset all the data and return to an EMPTY state.
   * @returns Reference to `this` model instance.
   */
  public override clear(): Reference {
    this.operator = null;
    super.clear();

    return this;
  }

  /**
   * Retrieve the identifier of the data contained in the model.
   * @returns The ID, or null if the model is in EMPTY state.
   */
  public getID(): string | null {
    return this.operator ? this.operator.getID() : null;
  }

  /**
   * Edit the data in the `Reference` model. The change is not saved until `.save()` is called.
   * @param input The reference data to be changed.
   * @returns Reference to `this` model instance.
   */
  public setData(input: Partial<IReference>): Reference {
    // The function to set the data.
    const edit_function = (data: IReferenceData | null): IReferenceData => {
      if (!data) {
        // Model instance has no data: initialize with the given input.

        // Assert that the input is sufficient to initialize the model's data.
        assertReference(input);

        return {
          ...input,
          statistics: {
            total_bulbs: 0,
          },
        };
      } else {
        // Model instance already has data: merge with the given input.
        return {
          ...data,
          ...input,
        };
      }
    };

    // Pass the editing function to super class for execution.
    super.executeEdit(edit_function);

    return this;
  }

  /**
   * Increment the total bulbs statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public increaseTotalBulbs(): Reference {
    // The function to increment total bulbs.
    const increment_function = (data: IReferenceData | null, status: ModelStatus): IReferenceData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw Error('Cannot increase total bulbs of empty data!');
      }

      data.statistics.total_bulbs++;

      return data;
    };

    // Pass the editing function to super class for execution.
    super.executeEdit(increment_function);

    return this;
  }

  /**
   * Decrement the total bulbs statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public decreaseTotalBulbs(): Reference {
    // The function to decrement total bulbs.
    const decrement_function = (data: IReferenceData | null, status: ModelStatus): IReferenceData => {
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
    super.executeEdit(decrement_function);

    return this;
  }

  /**
   * Save the `Reference` model's data into the database.
   * @returns Promise that resolves to void.
   */
  public async save(): Promise<void> {
    // The function to save the data.
    const save_function = async (data: IReferenceData): Promise<void> => {
      if (this.operator === null) {
        // Data has never been in the database: insert into database and create an operator.
        this.operator = await ReferenceOperator.create({ data });
      } else {
        // Data has either been inserted or been loaded: update to database.
        await this.operator.update({ data });
      }
    };

    // Pass the save function to super class for execution.
    await super.executeSave(save_function);
  }

  /**
   * Retrieve the `Reference` model's data from the database.
   * @param id The identifier of the data.
   * @returns Promise that resolves to void.
   */
  public async load(id: string): Promise<void> {
    // The function to load the data.
    const load_function = async (): Promise<IReferenceData> => {
      if (this.operator && this.operator.getID() === id) {
        // Trying to load data with the same ID as previous: do refresh instead.
        await this.operator.refresh();
      } else {
        // Retrieve the new data, create a new operator and replace the old operator.
        this.operator = await ReferenceOperator.retrieveOne({ id });
      }

      return this.operator.getData();
    };

    // Pass the load function to super class for execution.
    await super.executeLoad(load_function);
  }

  /**
   * Reload the `Reference` model's data from the database.
   * @returns Promise that resolves to void.
   */
  public async reload(): Promise<void> {
    // The function to reload the data.
    const reload_function = async (): Promise<IReferenceData> => {
      if (!this.operator) {
        throw Error('Cannot reload: data has never been loaded!');
      }

      await this.operator.refresh();

      return this.operator.getData();
    };

    // Pass the reload function to super class for execution.
    await super.executeLoad(reload_function);
  }
}

/**
 * Function to assert whether an object contains valid reference data.
 * @param input The object to assert.
 * @throws Type assertion exception.
 */
function assertReference(input: Partial<IReference>): asserts input is IReference {
  if (!input.name || !input.type) {
    throw Error('Provided input is not a complete reference type!');
  }
}