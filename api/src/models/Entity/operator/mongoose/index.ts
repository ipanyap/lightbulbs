import { HydratedDocument } from 'mongoose';
import { IBaseEntityData } from '../../types';
import { IDatabaseOperator } from '../types';
import { IExtractDataFunction, IInjectDataFunction, ILoadDocFunction } from './types';

/**
 * Class that implements `IDatabaseOperator` for MongoDB using mongoose library.
 */
export abstract class MongoDBOperator<
  EntityType extends IBaseEntityData,
  RawEntityType extends IBaseEntityData = EntityType,
> implements IDatabaseOperator<EntityType>
{
  private doc: HydratedDocument<RawEntityType>;
  private extractData: IExtractDataFunction<EntityType, RawEntityType>;
  private injectData: IInjectDataFunction<EntityType, RawEntityType>;
  private loadDoc: ILoadDocFunction<RawEntityType>;

  /**
   * Construct an operator that manages an entity record in MongoDB.
   * @param input.doc The document object created with mongoose.
   * @param input.extractData The function to extract entity data from Mongoose doc.
   * @param input.loadDoc The function to load Mongoose doc by ID.
   */
  protected constructor({
    doc,
    extractData,
    injectData,
    loadDoc,
  }: {
    doc: HydratedDocument<RawEntityType>;
    extractData: IExtractDataFunction<EntityType, RawEntityType>;
    injectData: IInjectDataFunction<EntityType, RawEntityType>;
    loadDoc: ILoadDocFunction<RawEntityType>;
  }) {
    this.doc = doc;
    this.extractData = extractData;
    this.injectData = injectData;
    this.loadDoc = loadDoc;
  }

  /**
   * Retrieve entity data from MongoDB client.
   */
  public getData(): EntityType {
    return this.extractData(this.doc);
  }

  /**
   * Retrieve document ID of entity data.
   */
  public getID(): string {
    return this.doc._id.toString();
  }

  /**
   * Reload entity data from MongoDB.
   */
  public async refresh(): Promise<void> {
    const id = this.getID();

    this.doc = await this.loadDoc(id);
  }

  /**
   * Update entity document and save it into MongoDB.
   */
  public async update(input: { data: Partial<EntityType> }): Promise<void> {
    const { data } = input;

    this.injectData(data, this.doc);

    await this.doc.save();
  }

  /**
   * Delete entity data from MongoDB. Currently not implemented.
   * @todo add implementation, whether using hard or soft deletion.
   */
  public async delete(): Promise<void> {}
}
