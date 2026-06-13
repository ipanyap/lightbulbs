import { Bulb } from '../../models/Bulb';
import { IBulbData } from '../../models/Bulb/types';
import { Category } from '../../models/Category';
import { ReferenceSource } from '../../models/ReferenceSource';
import { Tag } from '../../models/Tag';

/**
 * The input for `addBulb` workflow.
 */
export interface IAddBulbInput {
  data: {
    title: string;
    category: {
      id: string;
    };
    content: string;
    references: Array<{
      source: {
        id: string;
      };
      detail: string | null;
    }>;
    tags: Array<{ id: string }>;
  };
}

/**
 * Workflow to create a new bulb.
 * @param data The data of the bulb.
 * @return Promise that resolves to the created bulb data.
 */
export async function addBulb({ data }: IAddBulbInput): Promise<IBulbData> {
  /**
   * Step #1: Load the dependency entities from the database.
   */
  const category = new Category();
  await category.load(data.category.id);

  const references = await Promise.all(
    data.references.map(async ({ source, detail }) => {
      const reference_source = new ReferenceSource();
      await reference_source.load(source.id);

      return { source: reference_source, detail };
    })
  );

  const tags = await Promise.all(
    data.tags.map(async ({ id }) => {
      const tag = new Tag();
      await tag.load(id);

      return tag;
    })
  );

  /**
   * Step #2: Create the bulb model and link with the dependencies.
   */
  const bulb = new Bulb();

  bulb.setData({
    ...data,
    category,
  });

  references.forEach((reference) => {
    bulb.addReference(reference);
  });

  tags.forEach((tag) => {
    bulb.addTag(tag);
  });

  /**
   * Step #3: Insert the bulb record into the database and return it.
   */
  await bulb.save();

  return bulb.getData() as IBulbData;
}
