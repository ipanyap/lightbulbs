import { Bulb } from '../../models/Bulb';
import { IBulbData } from '../../models/Bulb/types';
import { Category } from '../../models/Category';
import { ICategoryData } from '../../models/Category/types';
import { ReferenceSource } from '../../models/ReferenceSource';
import { IReferenceSourceData } from '../../models/ReferenceSource/types';
import { Tag } from '../../models/Tag';
import { ITagData } from '../../models/Tag/types';

/**
 * The input for `fetchBulb` workflow.
 */
export interface IFetchBulbInput {
  key: { id: string };
}

/**
 * Workflow to retrieve a bulb's data.
 * @param key.id The identifier of the bulb.
 * @return Promise that resolves to the bulb data.
 */
export async function fetchBulb({ key: { id } }: IFetchBulbInput): Promise<IBulbData> {
  /**
   * Step #1: Load the bulb record from the database.
   */
  const bulb = new Bulb();

  await bulb.load(id);

  const data = bulb.getData() as IBulbData;

  /**
   * Step #2: Populate the data with the category detail.
   */
  const category = new Category();
  await category.load(data.category.id);

  /**
   * Step #3: Populate the data with the reference sources details.
   */
  const references = await Promise.all(
    data.references.map(async ({ source, detail }) => {
      const reference_source = new ReferenceSource();
      await reference_source.load(source.id);

      return { source: reference_source, detail };
    })
  );

  /**
   * Step #4: Populate the data with the tags details.
   */
  const tags = await Promise.all(
    data.tags.map(async ({ id }) => {
      const tag = new Tag();
      await tag.load(id);

      return tag;
    })
  );

  return {
    ...data,
    category: category.getData() as ICategoryData & { id: string },
    references: references.map(({ source, detail }) => ({
      source: source.getData() as IReferenceSourceData & { id: string },
      detail,
    })),
    tags: tags.map((tag) => tag.getData() as ITagData & { id: string }),
  };
}
