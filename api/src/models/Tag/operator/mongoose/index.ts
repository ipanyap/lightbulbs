import { FilterQuery, HydratedDocument, Types } from 'mongoose';
import { MongoDBOperator } from '../../../Entity/operator/mongoose';
import { ITag, ITagData, ITagFilter } from '../../types';
import { ITagOperator } from '../types';
import { TagModel } from './schema';
import { IRawTagData } from './types';

/**
 * Class that implements `TagOperator` for MongoDB database using mongoose library.
 */
export class MongoDBTagOperator extends MongoDBOperator<ITagData, IRawTagData> {
  /**
   * Construct an operator that manages a `Tag` record in MongoDB.
   * @param doc The document object created with mongoose.
   */
  private constructor(doc: HydratedDocument<IRawTagData>) {
    super({
      doc,
      extractData: extractTagData,
      injectData: injectTagData,
      loadDoc: loadTagDoc,
    });
  }

  /**
   * Save a new `Tag` document into MongoDB and return an operator to access it.
   */
  static async create(input: { data: ITagData }): Promise<ITagOperator> {
    const doc = new TagModel(convertModelDataToRawData(input.data));

    await doc.save();

    return new MongoDBTagOperator(doc);
  }

  /**
   * Query a `Tag` document by ID from MongoDB and return an operator to access it.
   */
  static async retrieveOne(input: { id: string }): Promise<ITagOperator> {
    const { id } = input;

    const doc = await loadTagDoc(id);

    return new MongoDBTagOperator(doc);
  }

  /**
   * Query all `Tag` documents matching the filter and return their requested fields.
   */
  static async findAll(input?: { filter?: ITagFilter; fields?: Array<keyof ITag> }): Promise<Array<Partial<ITagData>>> {
    const { filter: criteria, fields } = input || {};

    // Create a mongoose filter object.
    const filter: FilterQuery<IRawTagData> = {};
    if (criteria) {
      if (criteria.label) {
        filter.label = { $regex: criteria.label, $options: 'i' };
      }
      if (criteria.parent_id) {
        filter.parent_id = new Types.ObjectId(criteria.parent_id);
      }
      if (criteria.description) {
        filter.description = { $regex: criteria.description, $options: 'i' };
      }
    }

    // Create a mongoose projection (fields to retrieve) string.
    const projection = fields ? fields.join(' ') : null;

    // Execute MongoDB query.
    const docs = await TagModel.find(filter, projection);

    // Extract from query response and return the result.
    return docs.map(extractTagData);
  }
}

/**
 * Function to extract only attributes related to `Tag` from a mongoose document object.
 * @param doc The `Tag` document object created with mongoose.
 * @return The `Tag` data (may be full or partial depending on the executed query).
 */
function extractTagData(doc: HydratedDocument<IRawTagData>): ITagData;
function extractTagData(doc: HydratedDocument<IRawTagData>): Partial<ITagData> {
  const raw_data = doc.toObject();

  const data: Partial<ITagData> = {};

  // Convert mongoose model's default `_id` into the model data's `id`.
  data.id = raw_data._id.toString();

  if (raw_data.label !== undefined) {
    data.label = raw_data.label;
  }
  if (raw_data.parent_id !== undefined) {
    // Convert ObjectId to string
    data.parent_id = raw_data.parent_id && raw_data.parent_id.toString();
  }
  if (raw_data.description !== undefined) {
    data.description = raw_data.description;
  }
  if (raw_data.statistics !== undefined) {
    data.statistics = raw_data.statistics;
  }

  return data;
}

/**
 * Function to convert `Tag` model data to mongoose raw data.
 * @param data The `Tag` model data (may be partial).
 * @return The `Tag` raw data (may be partial).
 */
function convertModelDataToRawData(data: Partial<ITagData>): Partial<IRawTagData> {
  const { parent_id, ...others } = data;

  return {
    ...others,
    ...(parent_id === undefined
      ? {}
      : {
          parent_id: parent_id === null ? null : new Types.ObjectId(parent_id),
        }),
  };
}

/**
 * Function to inject some attributes of `Tag` data into related mongoose document object.
 * @param data The `Tag` data to be injected.
 * @param doc The `Tag` document object created with mongoose.
 */
function injectTagData(data: Partial<ITagData>, doc: HydratedDocument<IRawTagData>): void {
  Object.assign(doc, convertModelDataToRawData(data));
}

/**
 * Function to load `Tag` data by its ID.
 * @param id The identifier of the `Tag` data.
 * @return The document object with the latest `Tag` data in MongoDB.
 * @throws Document not found exception.
 */
async function loadTagDoc(id: string): Promise<HydratedDocument<IRawTagData>> {
  const doc = await TagModel.findById(id);

  if (!doc) {
    throw 'Documents not found!';
  }

  return doc;
}
