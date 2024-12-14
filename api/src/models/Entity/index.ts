import { IDatabaseOperator } from './operator/types';
import { IBaseEntityData, ModelStatus } from './types';

/**
 * Base class that models an entity and its related functionalities.
 */
export abstract class Entity<DataType extends IBaseEntityData> {
  private data: DataType | null;
  private status: ModelStatus;
  private operator: IDatabaseOperator<DataType> | null;

  /**
   * Create an entity model instance.
   * @param input The data to initialize the model. If not provided, the data will be null.
   */
  constructor(input?: DataType) {
    if (input) {
      this.data = input;
      this.status = ModelStatus.DIRTY;
    } else {
      this.data = null;
      this.status = ModelStatus.EMPTY;
    }
    this.operator = null;
  }

  /**
   * Reset all the data and return to an EMPTY state.
   * @returns Reference to `this` model instance.
   */
  public clear(): Entity<DataType> {
    this.operator = null;
    this.data = null;
    this.status = ModelStatus.EMPTY;

    return this;
  }

  /**
   * Retrieve entity data contained in the model.
   * @returns The data, or null if the model is in EMPTY state.
   */
  public getData(): DataType | null {
    return this.data;
  }

  /**
   * Retrieve the identifier of the data contained in the model.
   * @returns The ID, or null if the model is in EMPTY state.
   */
  public getID(): string | null {
    return this.operator ? this.operator.getID() : null;
  }

  /**
   * Retrieve the current status of the model.
   * @returns The status.
   */
  public getStatus(): ModelStatus {
    return this.status;
  }

  /**
   * Perform edit operation and handle the internal state validation or update.
   * @param edit The editing function, provided by the child class.
   */
  protected performEdit(edit: (data: DataType | null, status: ModelStatus) => DataType): void {
    this.data = edit(this.data, this.status);

    // Since there is unsaved change, change the status to DIRTY.
    this.status = ModelStatus.DIRTY;
  }

  /**
   * Save the model's data into the database.
   * @returns Promise that resolves to void.
   */
  public async save(): Promise<void> {
    // Cannot be performed on an EMPTY model.
    if (this.data === null || this.status === ModelStatus.EMPTY) {
      throw Error('Cannot perform save with empty data!');
    }

    if (this.operator === null) {
      // Data has never been in the database: insert into database and create an operator.
      this.operator = await this.createOperator(this.data);

      // Update record ID
      this.data.id = this.operator.getID();
    } else {
      // Data has either been inserted or been loaded: update to database.
      await this.operator.update({ data: this.data });
    }

    // Since the data is now in sync with the database, change the status to PRISTINE.
    this.status = ModelStatus.PRISTINE;
  }

  /**
   * Retrieve the model's data from the database.
   * @param id The identifier of the data.
   * @returns Promise that resolves to void.
   */
  public async load(id: string): Promise<void> {
    if (this.operator && this.operator.getID() === id) {
      // Trying to load data with the same ID as previous: do refresh instead.
      await this.operator.refresh();
    } else {
      // Retrieve the new data, create a new operator and replace the old operator.
      this.operator = await this.createOperator(id);
    }

    this.data = this.operator.getData();

    // Since the data is now in sync with the database, change the status to PRISTINE.
    this.status = ModelStatus.PRISTINE;
  }

  /**
   * Reload the model's data from the database.
   * @returns Promise that resolves to void.
   */
  public async reload(): Promise<void> {
    if (!this.operator) {
      throw Error('Cannot reload: data has never been loaded previously!');
    }

    await this.load(this.operator.getID());
  }

  /**
   * @abstract
   * Provides a new database operator instance.
   * As the operator type is specific for each model, implementation is handled by the child class.
   * @param input Either a record ID if loading existing DB record, or full entity data if inserting new record.
   * @returns Promise that resolves to the new operator instance.
   */
  protected abstract createOperator(input: string | DataType): Promise<IDatabaseOperator<DataType>>;
}
