import { AppError } from '@lightbulbs/common';
import { FilterQuery, HydratedDocument } from 'mongoose';
import { MongoDBOperator } from '../../../Entity/operator/mongoose';
import { IReferenceSource, IReferenceSourceData, IReferenceSourceFilter } from '../../types';
import { IReferenceSourceOperator } from '../types';
import { ReferenceSourceModel } from './schema';

/**
 * Class that implements `ReferenceSourceOperator` for MongoDB database using mongoose library.
 */
export class MongoDBReferenceSourceOperator extends MongoDBOperator<IReferenceSourceData> {
  /**
   * Construct an operator that manages a `ReferenceSource` record in MongoDB.
   * @param doc The document object created with mongoose.
   */
  private constructor(doc: HydratedDocument<IReferenceSourceData>) {
    super({
      doc,
      extractData: extractReferenceSourceData,
      injectData: injectReferenceSourceData,
      loadDoc: loadReferenceSourceDoc,
    });
  }

  /**
   * Save a new `ReferenceSource` document into MongoDB and return an operator to access it.
   */
  static async create(input: { data: IReferenceSourceData }): Promise<IReferenceSourceOperator> {
    const doc = new ReferenceSourceModel(input.data);

    await doc.save();

    return new MongoDBReferenceSourceOperator(doc);
  }

  /**
   * Query a `ReferenceSource` document by ID from MongoDB and return an operator to access it.
   */
  static async retrieveOne(input: { id: string }): Promise<IReferenceSourceOperator> {
    const { id } = input;

    const doc = await loadReferenceSourceDoc(id);

    return new MongoDBReferenceSourceOperator(doc);
  }

  /**
   * Query all `ReferenceSource` documents matching the filter and return their requested fields.
   */
  static async findAll(input?: {
    filter?: IReferenceSourceFilter;
    fields?: Array<keyof IReferenceSource>;
  }): Promise<Array<Partial<IReferenceSourceData>>> {
    const { filter: criteria, fields } = input || {};

    // Create a mongoose filter object.
    const filter: FilterQuery<IReferenceSourceData> = {};
    if (criteria) {
      if (criteria.name) {
        filter.name = { $regex: criteria.name, $options: 'i' };
      }
      if (criteria.type) {
        filter.type = criteria.type;
      }
      if (criteria.locator) {
        filter.locator = { $regex: criteria.locator, $options: 'i' };
      }
      if (criteria.description) {
        filter.description = { $regex: criteria.description, $options: 'i' };
      }
    }

    // Create a mongoose projection (fields to retrieve) string.
    const projection = fields ? fields.join(' ') : null;

    // Execute MongoDB query.
    const docs = await ReferenceSourceModel.find(filter, projection);

    // Extract from query response and return the result.
    return docs.map(extractReferenceSourceData);
  }
}

/**
 * Function to extract only attributes related to `ReferenceSource` from a mongoose document object.
 * @param doc The `ReferenceSource` document object created with mongoose.
 * @return The `ReferenceSource` data (may be full or partial depending on the executed query).
 */
function extractReferenceSourceData(doc: HydratedDocument<IReferenceSourceData>): IReferenceSourceData;
function extractReferenceSourceData(doc: HydratedDocument<IReferenceSourceData>): Partial<IReferenceSourceData> {
  const raw_data = doc.toObject();

  const data: Partial<IReferenceSourceData> = {};

  // Convert mongoose model's default `_id` into the model data's `id`.
  data.id = raw_data._id.toString();

  if (raw_data.name !== undefined) {
    data.name = raw_data.name;
  }
  if (raw_data.type !== undefined) {
    data.type = raw_data.type;
  }
  if (raw_data.locator !== undefined) {
    data.locator = raw_data.locator;
  }
  if (raw_data.image_url !== undefined) {
    data.image_url = raw_data.image_url;
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
 * Function to inject some attributes of `ReferenceSource` data into related mongoose document object.
 * @param data The `ReferenceSource` data to be injected.
 * @param doc The `ReferenceSource` document object created with mongoose.
 */
function injectReferenceSourceData(
  data: Partial<IReferenceSourceData>,
  doc: HydratedDocument<IReferenceSourceData>
): void {
  Object.assign(doc, data);
}

/**
 * Function to load `ReferenceSource` data by its ID.
 * @param id The identifier of the `ReferenceSource` data.
 * @return The document object with the latest `ReferenceSource` data in MongoDB.
 * @throws Document not found exception.
 */
async function loadReferenceSourceDoc(id: string): Promise<HydratedDocument<IReferenceSourceData>> {
  const doc = await ReferenceSourceModel.findById(id);

  if (!doc) {
    throw new AppError('Documents not found!');
  }

  return doc;
}
