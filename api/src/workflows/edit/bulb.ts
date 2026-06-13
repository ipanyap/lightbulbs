import { Bulb } from '../../models/Bulb';
import { IBulbData } from '../../models/Bulb/types';

/**
 * The input for `editBulb` workflow.
 */
export interface IEditBulbInput {
  key: {
    id: string;
  };
  data: {
    title?: string;
    content?: string;
  };
}

/**
 * Workflow to modify a bulb's data.
 * @param key.id The identifier of the bulb.
 * @param data The mutated data of the bulb.
 * @return Promise that resolves to the updated bulb data.
 */
export async function editBulb({ key: { id }, data }: IEditBulbInput): Promise<IBulbData> {
  /**
   * Step #1: Load the bulb record from the database.
   */
  const bulb = new Bulb();

  await bulb.load(id);

  /**
   * Step #2: Update the record and save to the database.
   */
  bulb.setData(data);

  await bulb.save();

  /**
   * Step #3: Return the updated bulb record.
   */
  return bulb.getData() as IBulbData;
}
