import { FilterQuery, HydratedDocument, Types } from 'mongoose';
import { MongoDBOperator } from '../../../Entity/operator/mongoose';
import { IBulb, IBulbData, IBulbFilter } from '../../types';
import { IBulbOperator } from '../types';
import { BulbModel } from './schema';
import { IRawBulbData } from './types';

/**
 * Class that implements `BulbOperator` for MongoDB database using mongoose library.
 */
export class MongoDBBulbOperator extends MongoDBOperator<IBulbData, IRawBulbData> {
  /**
   * Construct an operator that manages a `Bulb` record in MongoDB.
   * @param doc The document object created with mongoose.
   */
  private constructor(doc: HydratedDocument<IRawBulbData>) {
    super({
      doc,
      extractData: extractBulbData,
      injectData: injectBulbData,
      loadDoc: loadBulbDoc,
    });
  }

  /**
   * Save a new `Bulb` document into MongoDB and return an operator to access it.
   */
  static async create(input: { data: IBulbData }): Promise<IBulbOperator> {
    const doc = new BulbModel(convertModelDataToRawData(input.data));

    await doc.save();

    return new MongoDBBulbOperator(doc);
  }

  /**
   * Query a `Bulb` document by ID from MongoDB and return an operator to access it.
   */
  static async retrieveOne(input: { id: string }): Promise<IBulbOperator> {
    const { id } = input;

    const doc = await loadBulbDoc(id);

    return new MongoDBBulbOperator(doc);
  }

  /**
   * Query all `Bulb` documents matching the filter and return their requested fields.
   */
  static async findAll(input?: {
    filter?: IBulbFilter;
    fields?: Array<keyof IBulb>;
  }): Promise<Array<Partial<IBulbData>>> {
    const { filter: criteria, fields } = input || {};

    // Create a mongoose filter object.
    const filter: FilterQuery<IRawBulbData> = {};
    if (criteria) {
      if (criteria.title) {
        filter.title = { $regex: criteria.title, $options: 'i' };
      }
      if (criteria.content) {
        filter.content = { $regex: criteria.content, $options: 'i' };
      }
      if (criteria.categories) {
        filter.category_id = {
          $in: criteria.categories.map((category_id) => new Types.ObjectId(category_id)),
        };
      }
      if (criteria.references) {
        filter.references = {
          source: {
            $elemMatch: {
              $in: criteria.references.map((reference) => new Types.ObjectId(reference)),
            },
          },
        };
      }
      if (criteria.tags) {
        filter.tag_ids = {
          $elemMatch: {
            $in: criteria.tags.map((tag) => new Types.ObjectId(tag.id)),
          },
        };
      }
    }

    // Create a mongoose projection (fields to retrieve) string.
    const projection = fields ? fields.join(' ') : null;

    // Execute MongoDB query.
    const docs = await BulbModel.find(filter, projection);

    // Extract from query response and return the result.
    return docs.map(extractBulbData);
  }
}

/**
 * Function to extract only attributes related to `Bulb` from a mongoose document object.
 * @param doc The `Bulb` document object created with mongoose.
 * @return The `Bulb` data (may be full or partial depending on the executed query).
 */
function extractBulbData(doc: HydratedDocument<IRawBulbData>): IBulbData;
function extractBulbData(doc: HydratedDocument<IRawBulbData>): Partial<IBulbData> {
  const raw_data = doc.toObject();

  const data: Partial<IBulbData> = {};

  // Convert mongoose model's default `_id` into the model data's `id`.
  data.id = raw_data._id.toString();

  if (raw_data.title !== undefined) {
    data.title = raw_data.title;
  }
  if (raw_data.category_id !== undefined) {
    // Convert ObjectId to string
    data.category = {
      id: raw_data.category_id.toString(),
    };
  }
  if (raw_data.content !== undefined) {
    data.content = raw_data.content;
  }
  if (raw_data.references !== undefined) {
    data.references = raw_data.references.map(({ source_id, detail }) => ({
      source: {
        id: source_id.toString(),
      },
      detail,
    }));
  }
  if (raw_data.tag_ids !== undefined) {
    data.tags = raw_data.tag_ids.map((tag) => ({
      id: tag.toString(),
    }));
  }
  if (raw_data.past_versions !== undefined) {
    data.past_versions = raw_data.past_versions;
  }

  return data;
}

/**
 * Function to convert `Bulb` model data to mongoose raw data.
 * @param data The `Bulb` model data (may be partial).
 * @return The `Bulb` raw data (may be partial).
 */
function convertModelDataToRawData(data: Partial<IBulbData>): Partial<IRawBulbData> {
  const { category, references, tags, ...others } = data;

  return {
    ...others,
    ...(category === undefined
      ? {}
      : {
          category_id: new Types.ObjectId(category.id),
        }),
    ...(references === undefined
      ? {}
      : {
          references: references.map(({ source, detail }) => ({ source_id: new Types.ObjectId(source.id), detail })),
        }),
    ...(tags === undefined
      ? {}
      : {
          tag_ids: tags.map((tag) => new Types.ObjectId(tag.id)),
        }),
  };
}

/**
 * Function to inject some attributes of `Bulb` data into related mongoose document object.
 * @param data The `Bulb` data to be injected.
 * @param doc The `Bulb` document object created with mongoose.
 */
function injectBulbData(data: Partial<IBulbData>, doc: HydratedDocument<IRawBulbData>): void {
  Object.assign(doc, convertModelDataToRawData(data));
}

/**
 * Function to load `Bulb` data by its ID.
 * @param id The identifier of the `Bulb` data.
 * @return The document object with the latest `Bulb` data in MongoDB.
 * @throws Document not found exception.
 */
async function loadBulbDoc(id: string): Promise<HydratedDocument<IRawBulbData>> {
  const doc = await BulbModel.findById(id);

  if (!doc) {
    throw 'Documents not found!';
  }

  return doc;
}
