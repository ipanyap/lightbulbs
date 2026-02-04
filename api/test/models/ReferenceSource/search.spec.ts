import { expect } from 'chai';
import { ReferenceSourceOperator } from '../../../src/models/ReferenceSource/operator';
import { ReferenceSourceType } from '../../../src/models/ReferenceSource/types';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Search reference sources', function () {
  before(async function () {
    await DB.init([FixtureEntityType.REFERENCE_SOURCE]);
  });

  after(async function () {
    await DB.clear();
  });

  context('with filter only', function () {
    context('by name', function () {
      it('returns all records with matching names', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll({ filter: { name: 'trailer' } });
        const expected_reference_sources = DB.records().reference_sources.filter((record) =>
          record.name.toLowerCase().includes('trailer')
        );

        expect(reference_sources).to.have.deep.members(expected_reference_sources);
      });
    });

    context('by type', function () {
      it('returns all records with matching types', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll({
          filter: { type: ReferenceSourceType.MUSIC },
        });
        const expected_reference_sources = DB.records().reference_sources.filter(
          (record) => record.type === ReferenceSourceType.MUSIC
        );

        expect(reference_sources).to.have.deep.members(expected_reference_sources);
      });
    });

    context('by locator', function () {
      it('returns all records with matching locators', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll({ filter: { locator: 'youtube' } });
        const expected_reference_sources = DB.records().reference_sources.filter((record) =>
          record.locator?.toLowerCase().includes('youtube')
        );

        expect(reference_sources).to.have.deep.members(expected_reference_sources);
      });
    });

    context('by description', function () {
      it('returns all records with matching descriptions', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll({ filter: { description: 'famous' } });
        const expected_reference_sources = DB.records().reference_sources.filter((record) =>
          record.description?.toLowerCase().includes('famous')
        );

        expect(reference_sources).to.have.deep.members(expected_reference_sources);
      });
    });

    context('by multiple fields', function () {
      it('returns all records with matching fields', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll({
          filter: { description: 'famous', type: ReferenceSourceType.MUSIC },
        });
        const expected_reference_sources = DB.records().reference_sources.filter(
          (record) => record.description?.toLowerCase().includes('famous') && record.type === ReferenceSourceType.MUSIC
        );

        expect(reference_sources).to.have.deep.members(expected_reference_sources);
      });
    });
  });

  context('with fields selection only', function () {
    it('returns selected fields of all records', async function () {
      const reference_sources = await ReferenceSourceOperator.findAll({ fields: ['name', 'type'] });
      const expected_reference_sources = DB.records().reference_sources.map(({ id, name, type }) => ({
        id,
        name,
        type,
      }));

      expect(reference_sources).to.have.deep.members(expected_reference_sources);
    });
  });

  context('with both filter and fields selection', function () {
    it('returns selected fields of matching records', async function () {
      const reference_sources = await ReferenceSourceOperator.findAll({
        filter: { name: 'trailer' },
        fields: ['name'],
      });
      const expected_reference_sources = DB.records()
        .reference_sources.filter((record) => record.name.toLowerCase().includes('trailer'))
        .map(({ id, name }) => ({ id, name }));

      expect(reference_sources).to.have.deep.members(expected_reference_sources);
    });
  });

  context('without any filter nor fields selection', function () {
    it('returns all records with complete fields', async function () {
      const reference_sources = await ReferenceSourceOperator.findAll();

      expect(reference_sources).to.have.deep.members(DB.records().reference_sources);
    });
  });
});
