import { expect } from 'chai';
import { TagOperator } from '../../../src/models/Tag/operator';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Search tags', function () {
  before(async function () {
    await DB.init([FixtureEntityType.TAG]);
  });

  after(async function () {
    await DB.clear();
  });

  context('with filter only', function () {
    context('by label', function () {
      it('returns all records with matching labels', async function () {
        const tags = await TagOperator.findAll({ filter: { label: 'good' } });
        const expected_tags = DB.records().tags.filter((record) => record.label.toLowerCase().includes('good'));

        expect(tags).to.have.deep.members(expected_tags);
      });
    });

    context('by parent', function () {
      it('returns all records with matching parent', async function () {
        const parent_id = DB.records().tags[1].id;
        const tags = await TagOperator.findAll({ filter: { parent: { id: parent_id } } });
        const expected_tags = DB.records().tags.filter((record) => record.parent?.id === parent_id);

        expect(tags).to.have.deep.members(expected_tags);
      });
    });

    context('by description', function () {
      it('returns all records with matching descriptions', async function () {
        const tags = await TagOperator.findAll({ filter: { description: 'every' } });
        const expected_tags = DB.records().tags.filter((record) => record.description?.toLowerCase().includes('every'));

        expect(tags).to.have.deep.members(expected_tags);
      });
    });

    context('by multiple fields', function () {
      it('returns all records with matching fields', async function () {
        const tags = await TagOperator.findAll({ filter: { label: 'good', description: 'every' } });
        const expected_tags = DB.records().tags.filter(
          (record) => record.label.toLowerCase().includes('good') && record.description?.toLowerCase().includes('every')
        );

        expect(tags).to.have.deep.members(expected_tags);
      });
    });
  });

  context('with fields selection only', function () {
    it('returns selected fields of all records', async function () {
      const tags = await TagOperator.findAll({ fields: ['label'] });
      const expected_tags = DB.records().tags.map(({ id, label }) => ({ id, label }));

      expect(tags).to.have.deep.members(expected_tags);
    });
  });

  context('with both filter and fields selection', function () {
    it('returns selected fields of matching records', async function () {
      const tags = await TagOperator.findAll({ filter: { label: 'good' }, fields: ['label'] });
      const expected_tags = DB.records()
        .tags.filter((record) => record.label.toLowerCase().includes('good'))
        .map(({ id, label }) => ({ id, label }));

      expect(tags).to.have.deep.members(expected_tags);
    });
  });

  context('without any filter nor fields selection', function () {
    it('returns all records with complete fields', async function () {
      const tags = await TagOperator.findAll();

      expect(tags).to.have.deep.members(DB.records().tags);
    });
  });
});
