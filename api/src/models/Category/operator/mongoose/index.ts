import { FilterQuery, HydratedDocument } from 'mongoose';
import { ICategory, ICategoryData, ICategoryFilter } from '../../types';
import { ICategoryOperator } from '../types';
import { CategoryModel } from './schema';

/**
 * Class that implements `CategoryOperator` for MongoDB database using mongoose library.
 */
export class MongoDBCategoryOperator implements ICategoryOperator {
  private doc: HydratedDocument<ICategoryData>;

  /**
   * Construct an operator that manages a `Category` record in MongoDB.
   * @param doc The document object created with mongoose.
   */
  private constructor(doc: HydratedDocument<ICategoryData>) {
    this.doc = doc;
  }

  /**
   * Retrieve `Category` data from MongoDB client.
   */
  public getData(): ICategoryData {
    return extractCategoryData(this.doc);
  }

  /**
   * Retrieve document ID of `Category` data.
   */
  public getID(): string {
    return this.doc._id.toString();
  }

  /**
   * Reload `Category` data from MongoDB.
   */
  public async refresh(): Promise<void> {
    const id = this.getID();

    this.doc = await loadCategoryDoc(id);
  }

  /**
   * Update `Category` document and save it into MongoDB.
   */
  public async update(input: { data: Partial<ICategoryData> }): Promise<void> {
    const { data } = input;

    Object.assign(this.doc, data);

    await this.doc.save();
  }

  /**
   * Delete `Category` data from MongoDB. Currently not implemented.
   * @todo add implementation, whether using hard or soft deletion.
   */
  public async delete(): Promise<void> {}

  /**
   * Save a new `Category` document into MongoDB and return an operator to access it.
   */
  static async create(input: { data: ICategoryData }): Promise<ICategoryOperator> {
    const doc = new CategoryModel(input.data);

    await doc.save();

    return new MongoDBCategoryOperator(doc);
  }

  /**
   * Query a `Category` document by ID from MongoDB and return an operator to access it.
   */
  static async retrieveOne(input: { id: string }): Promise<ICategoryOperator> {
    const { id } = input;

    const doc = await loadCategoryDoc(id);

    return new MongoDBCategoryOperator(doc);
  }

  /**
   * Query all `Category` documents matching the filter and return their requested fields.
   */
  static async findAll(input?: {
    filter?: ICategoryFilter;
    fields?: Array<keyof ICategory>;
  }): Promise<Array<Partial<ICategoryData>>> {
    const { filter: criteria, fields } = input || {};

    // Create a mongoose filter object.
    const filter: FilterQuery<ICategoryData> = {};
    if (criteria) {
      if (criteria.name) {
        filter.name = { $regex: criteria.name, $options: 'i' };
      }
      if (criteria.description) {
        filter.description = { $regex: criteria.description, $options: 'i' };
      }
    }

    // Create a mongoose projection (fields to retrieve) string.
    const projection = fields ? fields.join(' ') : null;

    // Execute MongoDB query.
    const docs = await CategoryModel.find(filter, projection);

    // Extract from query response and return the result.
    return docs.map(extractCategoryData);
  }
}

/**
 * Function to extract only attributes related to `Category` from a mongoose document object.
 * @param doc The `Category` document object created with mongoose.
 * @return The `Category` data (may be full or partial depending on the executed query).
 */
function extractCategoryData(doc: HydratedDocument<ICategoryData>): ICategoryData;
function extractCategoryData(doc: HydratedDocument<ICategoryData>): Partial<ICategoryData> {
  const raw_data = doc.toObject();

  const data: Partial<ICategoryData> = {};

  // Convert mongoose model's default `_id` into the model data's `id`.
  data.id = raw_data._id.toString();

  if (raw_data.name) {
    data.name = raw_data.name;
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
 * Function to load `Category` data by its ID.
 * @param id The identifier of the `Category` data.
 * @return The document object with the latest `Category` data in MongoDB.
 * @throws Document not found exception.
 */
async function loadCategoryDoc(id: string): Promise<HydratedDocument<ICategoryData>> {
  const doc = await CategoryModel.findById(id);

  if (!doc) {
    throw 'Documents not found!';
  }

  return doc;
}
