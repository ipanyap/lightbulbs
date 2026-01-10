import { expect } from 'chai';
import { BulbOperator } from '../../../src/models/Bulb/operator';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Search bulbs', function () {
  before(async function () {
    await DB.init();
    await DB.populate([
      FixtureEntityType.CATEGORY,
      FixtureEntityType.REFERENCE_SOURCE,
      FixtureEntityType.TAG,
      FixtureEntityType.BULB,
    ]);
  });

  after(async function () {
    await DB.clear();
  });

  context('with filter only', function () {
    context('by title', function () {
      it('returns all records with matching titles', async function () {
        const bulbs = await BulbOperator.findAll({ filter: { title: 'mozart' } });
        const expected_bulbs = DB.records().bulbs.filter((record) => record.title.toLowerCase().includes('mozart'));

        expect(bulbs).to.have.deep.members(expected_bulbs);
      });
    });

    context('by content', function () {
      it('returns all records with matching contents', async function () {
        const bulbs = await BulbOperator.findAll({ filter: { content: 'responsibility' } });
        const expected_bulbs = DB.records().bulbs.filter((record) =>
          record.content?.toLowerCase().includes('responsibility')
        );

        expect(bulbs).to.have.deep.members(expected_bulbs);
      });
    });

    context('by categories', function () {
      it('returns all records with matching categories', async function () {
        const category_index = 3;
        const category_id = DB.records().categories[category_index].id;

        const bulbs = await BulbOperator.findAll({
          filter: { categories: [category_id] },
        });
        const expected_bulbs = DB.records().bulbs.filter((record) => record.category.id === category_id);

        expect(bulbs).to.have.deep.members(expected_bulbs);
      });
    });

    context('by reference sources', function () {
      it('returns all records with matching reference sources', async function () {
        const reference_source_index = 1;
        const reference_source_id = DB.records().reference_sources[reference_source_index].id;

        const bulbs = await BulbOperator.findAll({ filter: { references: [reference_source_id] } });
        const expected_bulbs = DB.records().bulbs.filter((record) =>
          record.references.some((reference) => reference.source.id === reference_source_id)
        );

        expect(bulbs).to.have.deep.members(expected_bulbs);
      });
    });

    context('by tags', function () {
      it('returns all records with matching tags', async function () {
        const tag_index = 3;
        const tag_id = DB.records().tags[tag_index].id;

        const bulbs = await BulbOperator.findAll({ filter: { tags: [tag_id] } });
        const expected_bulbs = DB.records().bulbs.filter((record) => record.tags.some((tag) => tag.id === tag_id));

        expect(bulbs).to.have.deep.members(expected_bulbs);
      });
    });

    context('by multiple fields', function () {
      it('returns all records with matching fields', async function () {
        const tag_index = 0;
        const tag_id = DB.records().tags[tag_index].id;

        const bulbs = await BulbOperator.findAll({ filter: { content: 'have', tags: [tag_id] } });
        const expected_bulbs = DB.records().bulbs.filter(
          (record) => record.content.toLowerCase().includes('have') && record.tags.some((tag) => tag.id === tag_id)
        );

        expect(bulbs).to.have.deep.members(expected_bulbs);
      });
    });
  });

  context('with fields selection only', function () {
    it('returns selected fields of all records', async function () {
      const bulbs = await BulbOperator.findAll({ fields: ['title'] });
      const expected_bulbs = DB.records().bulbs.map(({ id, title }) => ({ id, title }));

      expect(bulbs).to.have.deep.members(expected_bulbs);
    });
  });

  context('with both filter and fields selection', function () {
    it('returns selected fields of matching records', async function () {
      const bulbs = await BulbOperator.findAll({ filter: { content: 'have' }, fields: ['category'] });
      const expected_bulbs = DB.records()
        .bulbs.filter((record) => record.content.toLowerCase().includes('have'))
        .map(({ id, category }) => ({ id, category }));

      expect(bulbs).to.have.deep.members(expected_bulbs);
    });
  });

  context('without any filter nor fields selection', function () {
    it('returns all records with complete fields', async function () {
      const bulbs = await BulbOperator.findAll();

      expect(bulbs).to.have.deep.members(DB.records().bulbs);
    });
  });
});
