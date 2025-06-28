import { AppError } from '@lightbulbs/common';
import { Category } from '../Category';
import { Entity } from '../Entity';
import { ModelStatus } from '../Entity/types';
import { ReferenceSource } from '../ReferenceSource';
import { Tag } from '../Tag';
import { BulbOperator } from './operator';
import { IBulbOperator } from './operator/types';
import { IBulbData, IBulb } from './types';

/**
 * The type of reference in bulb's input type
 */
type IBulbReferenceInput = { source: ReferenceSource; detail: string | null };

/**
 * The input type for bulb, using other models
 */
type IBulbInput = Omit<IBulb, 'category' | 'references' | 'tags'> & {
  category: Category;
  references: Array<IBulbReferenceInput>;
  tags: Array<Tag>;
};

/**
 * Class that models a bulb and its related functionalities.
 */
export class Bulb extends Entity<IBulbData> {
  /**
   * Create a bulb model instance.
   * @param input The data to initialize the model. If not provided, the data will be null.
   */
  constructor(input?: IBulbInput) {
    let bulb_data: IBulbData | undefined;
    if (input) {
      const { category, references, tags, ...other_input } = input;

      bulb_data = {
        ...other_input,
        category: {
          id: extractEntityID(category),
        },
        references: references.map(({ source, detail }) => ({
          source: {
            id: extractEntityID(source),
          },
          detail,
        })),
        tags: tags.map((tag) => ({ id: extractEntityID(tag) })),
      };
    }

    super('bulb', bulb_data);
  }

  /**
   * Edit the data in the `Bulb` model. The change is not saved until `.save()` is called.
   * @param input The bulb data to be changed (excluding references, tags, and past_versions).
   * @returns Reference to `this` model instance.
   */
  public setData(input: Partial<Omit<IBulbInput, 'references' | 'tags' | 'past_versions'>>): Bulb {
    const { category, ...other_input } = input;

    // Get category's identifier. The category should already exist in database.
    const category_id = category && extractEntityID(category);

    const processed_input = {
      ...other_input,
      ...(category_id ? { category: { id: category_id } } : {}),
    };

    // The function to set the data.
    const edit_function = (data: IBulbData | null): IBulbData => {
      if (!data) {
        /**
         * Model instance has no data: initialize with the given input.
         */

        // Assert that the input is sufficient to initialize the model's data.
        assertBulb(processed_input);

        // Provide default attributes
        const default_attributes = {
          references: [],
          tags: [],
          past_versions: [],
        };

        return {
          ...default_attributes,
          ...processed_input,
        };
      } else {
        /**
         * Model instance already has data: merge with the given input.
         */

        return {
          ...data,
          ...processed_input,
        };
      }
    };

    // Pass the editing function to super class for execution.
    super.performEdit(edit_function);

    return this;
  }

  /**
   * Add new item to the references list. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public addReference(reference: IBulbReferenceInput): Bulb {
    // The function to add new reference.
    const add_function = (data: IBulbData | null, status: ModelStatus): IBulbData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw new AppError('Cannot add a reference to empty data!');
      }

      // Get source's identifier. The source should already exist in database.
      const source_id = extractEntityID(reference.source);

      // Ensure the reference has not been in the list.
      if (data.references.findIndex((reference) => reference.source.id === source_id) !== -1) {
        throw new AppError('The reference to add already belongs to the bulb!');
      }

      data.references.push({
        source: {
          id: source_id,
        },
        detail: reference.detail,
      });

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(add_function);

    return this;
  }

  /**
   * Remove item from the references list. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public removeReference(source: ReferenceSource): Bulb {
    // The function to remove existing reference.
    const remove_function = (data: IBulbData | null, status: ModelStatus): IBulbData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw new AppError('Cannot remove a reference from empty data!');
      }

      // Get source's identifier. The source should already exist in database.
      const source_id = extractEntityID(source);

      // Ensure the reference is found in the list.
      const reference_index = data.references.findIndex((reference) => reference.source.id === source_id);
      if (reference_index === -1) {
        throw new AppError('The reference to remove does not belong to the bulb!');
      }

      data.references.splice(reference_index, 1);

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(remove_function);

    return this;
  }

  /**
   * Add new item to the tags list. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public addTag(tag: Tag): Bulb {
    // The function to add new tag.
    const add_function = (data: IBulbData | null, status: ModelStatus): IBulbData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw new AppError('Cannot add a tag to empty data!');
      }

      // Get tag's identifier. The tag should already exist in database.
      const tag_id = extractEntityID(tag);

      // Ensure the tag has not been in the list.
      if (data.tags.findIndex((tag) => tag.id === tag_id) !== -1) {
        throw new AppError('The tag to add already belongs to the bulb!');
      }

      data.tags.push({
        id: tag_id,
      });

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(add_function);

    return this;
  }

  /**
   * Remove item from the tags list. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public removeTag(tag: Tag): Bulb {
    // The function to remove existing tag.
    const remove_function = (data: IBulbData | null, status: ModelStatus): IBulbData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw new AppError('Cannot remove a tag from empty data!');
      }

      // Get tag's identifier. The tag should already exist in database.
      const tag_id = extractEntityID(tag);

      // Ensure the tag is found in the list.
      const tag_index = data.tags.findIndex((tag) => tag.id === tag_id);
      if (tag_index === -1) {
        throw new AppError('The tag to remove does not belong to the bulb!');
      }

      data.tags.splice(tag_index, 1);

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(remove_function);

    return this;
  }

  /**
   * Archive current content and create a new version. The change is not saved until `.save()` is called.
   * @returns Reference to `this` model instance.
   */
  public archiveCurrentVersion(): Bulb {
    // The function to archive current version of the content.
    const archive_function = (data: IBulbData | null, status: ModelStatus): IBulbData => {
      // Cannot be performed on an EMPTY model.
      if (data === null || status === ModelStatus.EMPTY) {
        throw new AppError('Cannot archive content of empty data!');
      }

      // Push the current version to the beginning of the list of past versions
      data.past_versions.unshift({
        archived_at: new Date(),
        content: data.content,
      });

      return data;
    };

    // Pass the editing function to super class for execution.
    super.performEdit(archive_function);

    return this;
  }

  /**
   * Provides a new database operator instance for bulb model.
   * @param input Either a record ID if loading existing bulb data, or primary bulb data if inserting new record.
   * @returns Promise that resolves to the new bulb operator instance.
   */
  protected async createOperator(input: string | IBulbData): Promise<IBulbOperator> {
    if (typeof input === 'string') {
      return await BulbOperator.retrieveOne({ id: input });
    } else {
      return await BulbOperator.create({ data: input });
    }
  }
}

/**
 * Function to assert whether an object contains valid bulb data.
 * @param input The object to assert.
 * @throws Type assertion exception.
 */
function assertBulb(input: Partial<IBulb>): asserts input is IBulb {
  if (!input.title || !input.content || !input.category || !input.category.id) {
    throw new AppError('The provided input is not a complete bulb type!');
  }
}

/**
 * Function to extract identifier of an entity.
 * @param input The category, reference_source, or tag to assert.
 * @throws Null identifier exception.
 */
function extractEntityID(entity: Category | ReferenceSource | Tag): string {
  const entity_id = entity.getID();

  if (entity_id === null) {
    throw new AppError('The ' + entity.name + ' does not exist in database!');
  }

  return entity_id;
}
