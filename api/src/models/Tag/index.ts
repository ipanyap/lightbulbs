import { Entity } from '../Entity';
import { ModelStatus } from '../Entity/types';
import { TagOperator } from './operator';
import { ITagOperator } from './operator/types';
import { ITagData, ITag } from './types';

/**
 * Class that models a tag and its related functionalities.
 */
export class Tag extends Entity<ITagData> {
  /**
   * Create a tag model instance.
   * @param input The data to initialize the model. If not provided, the data will be null.
   */
  constructor(input?: ITag) {
    if (input) {
      super({
        ...input,
        statistics: {
          total_bulbs: 0,
          total_children: 0,
        },
      });
    } else {
      super();
    }
  }

  /**
   * Edit the data in the `Tag` model. The change is not saved until `.save()` is called.
   * @param input The tag data to be changed (excluding parent_id).
   * @returns Reference to `this` model instance.
   */
  public setData(input: Partial<Omit<ITag, 'parent'>>): Tag {
    // The function to set the data.
    const edit_function = (data: ITagData | null): ITagData => {
      if (!data) {
        /**
         * Model instance has no data: initialize with the given input.
         */

        // Assert that the input is sufficient to initialize the model's data.
        assertTag(input);

        // Provide default attributes
        const default_attributes = {
          parent: null,
          description: null,
        };

        return {
          ...default_attributes,
          ...input,
          statistics: {
            total_bulbs: 0,
            total_children: 0,
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
   * Link the `Tag` model as child of another. The change is not saved until `.save()` is called.
   * @param parent The parent tag, or null if unlinking.
   * @returns Reference to `this` model instance.
   */
  public linkTo(parent: Tag | null): Tag {
    // The function to link this tag instance as child of the parent tag.
    const link_function = (data: ITagData | null, status: ModelStatus): ITagData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw Error('Cannot link tag with empty data!');
      }

      if (parent) {
        // Get parent tag's identifier. The parent tag should already exist in database.
        const parent_id = parent.getID();

        if (parent_id === null) {
          throw Error('The tag referenced as parent does not exist in database!');
        } else if (parent_id === data.id) {
          throw Error('Cannot link a tag with itself!');
        }

        data.parent = {
          id: parent_id,
        };
      } else {
        data.parent = null;
      }

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(link_function);

    return this;
  }

  /**
   * Increment the total bulbs statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public increaseTotalBulbs(): Tag {
    // The function to increment total bulbs.
    const increment_function = (data: ITagData | null, status: ModelStatus): ITagData => {
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
  public decreaseTotalBulbs(): Tag {
    // The function to decrement total bulbs.
    const decrement_function = (data: ITagData | null, status: ModelStatus): ITagData => {
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
   * Increment the total children statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public increaseTotalChildren(): Tag {
    // The function to increment total children.
    const increment_function = (data: ITagData | null, status: ModelStatus): ITagData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw Error('Cannot increase total children of empty data!');
      }

      data.statistics.total_children++;

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(increment_function);

    return this;
  }

  /**
   * Decrement the total children statistic. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public decreaseTotalChildren(): Tag {
    // The function to decrement total children.
    const decrement_function = (data: ITagData | null, status: ModelStatus): ITagData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw Error('Cannot decrease total children of empty data!');
      }

      // Cannot be performed on zero or negative total.
      if (data.statistics.total_children <= 0) {
        throw Error('Invalid operation: total children has already reached 0');
      }

      data.statistics.total_children--;

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(decrement_function);

    return this;
  }

  /**
   * Provides a new database operator instance for tag model.
   * @param input Either a record ID if loading existing tag data, or primary tag data if inserting new record.
   * @returns Promise that resolves to the new tag operator instance.
   */
  protected async createOperator(input: string | ITagData): Promise<ITagOperator> {
    if (typeof input === 'string') {
      return await TagOperator.retrieveOne({ id: input });
    } else {
      return await TagOperator.create({ data: input });
    }
  }
}

/**
 * Function to assert whether an object contains valid tag data.
 * @param input The object to assert.
 * @throws Type assertion exception.
 */
function assertTag(input: Partial<ITag>): asserts input is ITag {
  if (!input.label) {
    throw Error('The provided input is not a complete tag type!');
  }
}
