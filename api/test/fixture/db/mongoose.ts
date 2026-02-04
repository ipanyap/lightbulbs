import { BulbOperator } from '../../../src/models/Bulb/operator';
import { BulbModel } from '../../../src/models/Bulb/operator/mongoose/schema';
import { IBulbOperator } from '../../../src/models/Bulb/operator/types';
import { CategoryOperator } from '../../../src/models/Category/operator';
import { CategoryModel } from '../../../src/models/Category/operator/mongoose/schema';
import { ICategoryOperator } from '../../../src/models/Category/operator/types';
import { ReferenceSourceOperator } from '../../../src/models/ReferenceSource/operator';
import { ReferenceSourceModel } from '../../../src/models/ReferenceSource/operator/mongoose/schema';
import { IReferenceSourceOperator } from '../../../src/models/ReferenceSource/operator/types';
import { TagOperator } from '../../../src/models/Tag/operator';
import { TagModel } from '../../../src/models/Tag/operator/mongoose/schema';
import { ITagOperator } from '../../../src/models/Tag/operator/types';
import { BULB_RECORDS, CATEGORY_RECORDS, REFERENCE_SOURCE_RECORDS, TAG_RECORDS } from '../records';
import { FixtureEntityType, IPopulatedEntities, IFixtureDBClient } from './types';

/**
 * Class that implements `IFixtureDBClient` for MongoDB using mongoose models.
 */
export class FixtureMongoDBClient implements IFixtureDBClient {
  private operators: {
    categories: Array<ICategoryOperator>;
    reference_sources: Array<IReferenceSourceOperator>;
    tags: Array<ITagOperator>;
    bulbs: Array<IBulbOperator>;
  };

  private data: IPopulatedEntities;

  /**
   * The flag to indicate whether the fixture DB is ready to be used
   */
  private is_active: boolean;

  constructor() {
    this.operators = { categories: [], reference_sources: [], tags: [], bulbs: [] };
    this.data = { categories: [], reference_sources: [], tags: [], bulbs: [] };
    this.is_active = false;
  }

  public async init(entities: Array<FixtureEntityType> = []) {
    // Validation: ensure the database is not in use
    if (this.is_active) {
      throw new Error('DB is already in use! Clear the DB first.');
    }

    // Validation: ensure there are no missing entity dependencies
    if (entities.includes(FixtureEntityType.BULB)) {
      const missing_dependencies: Array<FixtureEntityType> = [
        FixtureEntityType.CATEGORY,
        FixtureEntityType.REFERENCE_SOURCE,
        FixtureEntityType.TAG,
      ];

      for (let i = missing_dependencies.length - 1; i >= 0; i--) {
        if (entities.includes(missing_dependencies[i])) {
          missing_dependencies.splice(i, 1);
        }
      }

      if (missing_dependencies.length > 0) {
        throw new Error(
          `Populating BULB entity is missing the following dependencies: ${missing_dependencies.join(', ')}`
        );
      }
    }

    // Create indexes
    const models_with_indexes = [CategoryModel, ReferenceSourceModel, TagModel];
    for (const model of models_with_indexes) {
      await model.createIndexes();
    }

    // Populate category data
    const category_map: Record<string, string> = {};
    if (entities.includes(FixtureEntityType.CATEGORY)) {
      for (const record of CATEGORY_RECORDS) {
        const operator = await CategoryOperator.create({ data: record });

        this.operators.categories.push(operator);
        category_map[record.name] = operator.getID();
      }
    }

    // Populate reference source data
    const reference_source_map: Record<string, string> = {};
    if (entities.includes(FixtureEntityType.REFERENCE_SOURCE)) {
      for (const record of REFERENCE_SOURCE_RECORDS) {
        const operator = await ReferenceSourceOperator.create({ data: record });

        this.operators.reference_sources.push(operator);
        reference_source_map[record.name] = operator.getID();
      }
    }

    // Populate tag data
    const tag_map: Record<string, string> = {};
    if (entities.includes(FixtureEntityType.TAG)) {
      for (const record of TAG_RECORDS) {
        const operator = await TagOperator.create({
          data: {
            ...record,
            parent: record.parent ? { id: tag_map[record.parent.id] } : null,
          },
        });

        this.operators.tags.push(operator);
        tag_map[record.label] = operator.getID();
      }
    }

    // Populate bulb data
    if (entities.includes(FixtureEntityType.BULB)) {
      for (const record of BULB_RECORDS) {
        const operator = await BulbOperator.create({
          data: {
            ...record,
            category: { id: category_map[record.category.id] },
            references: record.references.map((reference) => ({
              ...reference,
              source: { id: reference_source_map[reference.source.id] },
            })),
            tags: record.tags.map((tag) => ({ id: tag_map[tag.id] })),
          },
        });

        this.operators.bulbs.push(operator);
      }
    }

    // Store data locally
    this.extract();

    // Mark the client as active
    this.is_active = true;
  }

  public records() {
    return this.data;
  }

  public async refresh() {
    // Validation: ensure the database is usable
    if (!this.is_active) {
      throw new Error('DB is not active! Init the DB first.');
    }

    // Re-synchronize all operators
    for (const operator of this.operators.categories) {
      await operator.refresh();
    }
    for (const operator of this.operators.reference_sources) {
      await operator.refresh();
    }
    for (const operator of this.operators.tags) {
      await operator.refresh();
    }
    for (const operator of this.operators.bulbs) {
      await operator.refresh();
    }

    // Update local data
    this.extract();
  }

  public async clear() {
    // Drop entity collections
    const models = [BulbModel, CategoryModel, ReferenceSourceModel, TagModel];
    for (const model of models) {
      await model.collection.drop();
    }

    // Reset member variables
    this.operators = { categories: [], reference_sources: [], tags: [], bulbs: [] };
    this.data = { categories: [], reference_sources: [], tags: [], bulbs: [] };
    this.is_active = false;
  }

  /**
   * Extract the data from MongoDB operators and store them locally.
   */
  private extract() {
    this.data = {
      categories: this.operators.categories.map((operator) => operator.getData()),
      reference_sources: this.operators.reference_sources.map((operator) => operator.getData()),
      tags: this.operators.tags.map((operator) => operator.getData()),
      bulbs: this.operators.bulbs.map((operator) => operator.getData()),
    } as IPopulatedEntities;
  }
}
