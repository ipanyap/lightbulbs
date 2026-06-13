import { BulbOperator } from '../../models/Bulb/operator';
import { IBulbData } from '../../models/Bulb/types';

/**
 * Workflow to search for bulbs matching the criteria.
 * @return Promise that resolves to the list of bulbs.
 */
export async function findBulbs(): Promise<Array<Partial<IBulbData>>> {
  /**
   * Step #1: Retrieve all bulbs.
   */
  return await BulbOperator.findAll();
}
