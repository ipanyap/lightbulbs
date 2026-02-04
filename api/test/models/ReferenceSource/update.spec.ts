import { expect } from 'chai';
import { ModelStatus } from '../../../src/models/Entity/types';
import { ReferenceSource } from '../../../src/models/ReferenceSource';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Update a reference source', function () {
  before(async function () {
    await DB.init([FixtureEntityType.REFERENCE_SOURCE]);
  });

  after(async function () {
    await DB.clear();
  });

  const index = 0;
  const reference_source = new ReferenceSource();

  describe('# Arrange', function () {
    it('starts with a loaded model', async function () {
      const reference_source_record = DB.records().reference_sources[index];

      await reference_source.load(reference_source_record.id);

      expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
      expect(reference_source.getData()).to.deep.equal(reference_source_record);
    });
  });

  describe('# Act', function () {
    it('edits the data', function () {
      const input = { name: 'New name', description: 'New description' };
      reference_source.setData(input);

      expect(reference_source.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(reference_source.getData()).to.containSubset(input);
    });

    it('increases total bulbs twice', function () {
      reference_source.increaseTotalBulbs().increaseTotalBulbs();

      expect(reference_source.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(reference_source.getData()).to.containSubset({ statistics: { total_bulbs: 2 } });
    });

    it('decreases total bulbs once', function () {
      reference_source.decreaseTotalBulbs();

      expect(reference_source.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(reference_source.getData()).to.containSubset({ statistics: { total_bulbs: 1 } });
    });

    it('saves successfully', async function () {
      let error: Error | null = null;
      try {
        await reference_source.save();
      } catch (e) {
        error = e as Error;
      }

      expect(error).to.be.null;
    });
  });

  describe('# Assert', function () {
    it('updates the model', function () {
      expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
    });

    it('updates the record in the database', async function () {
      await DB.refresh();

      expect(DB.records().reference_sources[index]).to.deep.equal(reference_source.getData());
    });
  });
});
