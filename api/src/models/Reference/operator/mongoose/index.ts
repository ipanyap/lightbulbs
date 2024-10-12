import { FilterQuery, HydratedDocument } from 'mongoose';
import { IReference, IReferenceData, IReferenceFilter } from '../../types';
import { IReferenceOperator } from '../types';
import { ReferenceModel } from './schema';

/**
 * Class that implements `ReferenceOperator` for MongoDB database using mongoose library.
 */
export class MongoDBReferenceOperator implements IReferenceOperator {
  private doc: HydratedDocument<IReferenceData>;

  /**
   * Construct an operator that manages a `Reference` record in MongoDB.
   * @param doc The document object created with mongoose.
   */
  private constructor(doc: HydratedDocument<IReferenceData>) {
    this.doc = doc;
  }

  /**
   * Retrieve `Reference` data from MongoDB client.
   */
  public getData(): IReferenceData {
    return extractReferenceData(this.doc);
  }

  /**
   * Retrieve document ID of `Reference` data.
   */
  public getID(): string {
    return this.doc._id.toString();
  }

  /**
   * Reload `Reference` data from MongoDB.
   */
  public async refresh(): Promise<void> {
    const id = this.getID();

    this.doc = await loadReferenceDoc(id);
  }

  /**
   * Update `Reference` document and save it into MongoDB.
   */
  public async update(input: { data: Partial<IReferenceData> }): Promise<void> {
    const { data } = input;

    Object.assign(this.doc, data);

    await this.doc.save();
  }

  /**
   * Delete `Reference` data from MongoDB. Currently not implemented.
   * @todo add implementation, whether using hard or soft deletion.
   */
  public async delete(): Promise<void> {}

  /**
   * Save a new `Reference` document into MongoDB and return an operator to access it.
   */
  static async create(input: { data: IReferenceData }): Promise<IReferenceOperator> {
    const doc = new ReferenceModel(input.data);

    await doc.save();

    return new MongoDBReferenceOperator(doc);
  }

  /**
   * Query a `Reference` document by ID from MongoDB and return an operator to access it.
   */
  static async retrieveOne(input: { id: string }): Promise<IReferenceOperator> {
    const { id } = input;

    const doc = await loadReferenceDoc(id);

    return new MongoDBReferenceOperator(doc);
  }

  /**
   * Query all `Reference` documents matching the filter and return their requested fields.
   */
  static async findAll(input?: {
    filter?: IReferenceFilter;
    fields?: Array<keyof IReference>;
  }): Promise<Array<Partial<IReferenceData>>> {
    const { filter: criteria, fields } = input || {};

    // Create a mongoose filter object.
    const filter: FilterQuery<IReferenceData> = {};
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
    const docs = await ReferenceModel.find(filter, projection);

    // Extract from query response and return the result.
    return docs.map(extractReferenceData);
  }
}

/**
 * Function to extract only attributes related to `Reference` from a mongoose document object.
 * @param doc The `Reference` document object created with mongoose.
 * @return The `Reference` data (may be full or partial depending on the executed query).
 */
function extractReferenceData(doc: HydratedDocument<IReferenceData>): IReferenceData;
function extractReferenceData(doc: HydratedDocument<IReferenceData>): Partial<IReferenceData> {
  const raw_data = doc.toObject();

  const data: Partial<IReferenceData> = {};

  // Convert mongoose model's default `_id` into the model data's `id`.
  data.id = raw_data._id.toString();

  if (raw_data.name) {
    data.name = raw_data.name;
  }
  if (raw_data.type) {
    data.type = raw_data.type;
  }
  if (raw_data.locator) {
    data.locator = raw_data.locator;
  }
  if (raw_data.image_url) {
    data.image_url = raw_data.image_url;
  }
  if (raw_data.description) {
    data.description = raw_data.description;
  }
  if (raw_data.statistics) {
    data.statistics = raw_data.statistics;
  }

  return data;
}

/**
 * Function to load `Reference` data by its ID.
 * @param id The identifier of the `Reference` data.
 * @return The document object with the latest `Reference` data in MongoDB.
 * @throws Document not found exception.
 */
async function loadReferenceDoc(id: string): Promise<HydratedDocument<IReferenceData>> {
  const doc = await ReferenceModel.findById(id);

  if (!doc) {
    throw 'Documents not found!';
  }

  return doc;
}