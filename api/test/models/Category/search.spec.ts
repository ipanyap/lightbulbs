import { expect } from 'chai';
import { CategoryOperator } from '../../../src/models/Category/operator';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Search categories', function () {
  before(async function () {
    await DB.init();
    await DB.populate([FixtureEntityType.CATEGORY]);
  });

  after(async function () {
    await DB.clear();
  });

  context('with filter only', function () {
    context('by name', function () {
      it('returns all records with matching names', async function () {
        const categories = await CategoryOperator.findAll({ filter: { name: 'stuff' } });
        const expected_categories = DB.records().categories.filter((record) =>
          record.name.toLowerCase().includes('stuff')
        );

        expect(categories).to.have.deep.members(expected_categories);
      });
    });

    context('by description', function () {
      it('returns all records with matching descriptions', async function () {
        const categories = await CategoryOperator.findAll({ filter: { description: 'about' } });
        const expected_categories = DB.records().categories.filter((record) =>
          record.description?.toLowerCase().includes('about')
        );

        expect(categories).to.have.deep.members(expected_categories);
      });
    });

    context('by multiple fields', function () {
      it('returns all records with matching fields', async function () {
        const categories = await CategoryOperator.findAll({ filter: { name: 'stuff', description: 'my' } });
        const expected_categories = DB.records().categories.filter(
          (record) => record.name.toLowerCase().includes('stuff') && record.description?.toLowerCase().includes('my')
        );

        expect(categories).to.have.deep.members(expected_categories);
      });
    });
  });

  context('with fields selection only', function () {
    it('returns selected fields of all records', async function () {
      const categories = await CategoryOperator.findAll({ fields: ['name'] });
      const expected_categories = DB.records().categories.map(({ id, name }) => ({ id, name }));

      expect(categories).to.have.deep.members(expected_categories);
    });
  });

  context('with both filter and fields selection', function () {
    it('returns selected fields of matching records', async function () {
      const categories = await CategoryOperator.findAll({ filter: { name: 'stuff' }, fields: ['name'] });
      const expected_categories = DB.records()
        .categories.filter((record) => record.name.toLowerCase().includes('stuff'))
        .map(({ id, name }) => ({ id, name }));

      expect(categories).to.have.deep.members(expected_categories);
    });
  });

  context('without any filter nor fields selection', function () {
    it('returns all records with complete fields', async function () {
      const categories = await CategoryOperator.findAll();

      expect(categories).to.have.deep.members(DB.records().categories);
    });
  });
});
