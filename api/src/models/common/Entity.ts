import { IEntityData, ModelStatus } from './types';

/**
 * Base class that models an entity and its related functionalities.
 */
export abstract class Entity<DataType extends IEntityData> {
  private data: DataType | null;
  private status: ModelStatus;

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
  }

  /**
   * Reset all the data and return to an EMPTY state.
   * @returns Reference to `this` model instance.
   */
  public clear(): Entity<DataType> {
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
  protected executeEdit(edit: (data: DataType | null, status: ModelStatus) => DataType): void {
    this.data = edit(this.data, this.status);

    // Since there is unsaved change, change the status to DIRTY
    this.status = ModelStatus.DIRTY;
  }

  /**
   * Perform save operation and handle the internal state validation or update.
   * @param save The save function, provided by the child class.
   * @returns Promise that resolves to void.
   */
  protected async executeSave(save: (data: DataType) => Promise<void>): Promise<void> {
    // Cannot be performed on an EMPTY model
    if (this.data === null || this.status === ModelStatus.EMPTY) {
      throw Error('Cannot perform save with empty data!');
    }

    await save(this.data);

    // Since the data is now in sync with the database, change the status to PRISTINE
    this.status = ModelStatus.PRISTINE;
  }

  /**
   * Perform load operation and handle the internal state validation or update.
   * @param load The load function, provided by the child class.
   * @returns Promise that resolves to void.
   */
  protected async executeLoad(load: () => Promise<DataType>): Promise<void> {
    this.data = await load();

    // Since the data is now in sync with the database, change the status to PRISTINE
    this.status = ModelStatus.PRISTINE;
  }

  /**
   * @abstract
   * Save the model's data into the database. Implementation is handled by the child class.
   * @returns Promise that resolves to void.
   */
  public abstract save(): Promise<void>;

  /**
   * @abstract
   * Retrieve the model's data from the database. Implementation is handled by the child class.
   * @param id The identifier of the data.
   * @returns Promise that resolves to void.
   */
  public abstract load(id: string): Promise<void>;

  /**
   * @abstract
   * Reload the model's data from the database. Implementation is handled by the child class.
   * @returns Promise that resolves to void.
   */
  public abstract reload(): Promise<void>;
}
