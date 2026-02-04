import { expect } from 'chai';
import { Category } from '../../../src/models/Category';
import { ModelStatus } from '../../../src/models/Entity/types';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Update a category', function () {
  before(async function () {
    await DB.init([FixtureEntityType.CATEGORY]);
  });

  after(async function () {
    await DB.clear();
  });

  const index = 0;
  const category = new Category();

  describe('# Arrange', function () {
    it('starts with a loaded model', async function () {
      const category_record = DB.records().categories[index];

      await category.load(category_record.id);

      expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
      expect(category.getData()).to.deep.equal(category_record);
    });
  });

  describe('# Act', function () {
    it('edits the data', function () {
      const input = { name: 'New name', description: 'New description' };
      category.setData(input);

      expect(category.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(category.getData()).to.containSubset(input);
    });

    it('increases total bulbs twice', function () {
      category.increaseTotalBulbs().increaseTotalBulbs();

      expect(category.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(category.getData()).to.containSubset({ statistics: { total_bulbs: 2 } });
    });

    it('decreases total bulbs once', function () {
      category.decreaseTotalBulbs();

      expect(category.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(category.getData()).to.containSubset({ statistics: { total_bulbs: 1 } });
    });

    it('saves successfully', async function () {
      let error: Error | null = null;
      try {
        await category.save();
      } catch (e) {
        error = e as Error;
      }

      expect(error).to.be.null;
    });
  });

  describe('# Assert', function () {
    it('updates the model', function () {
      expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
    });

    it('updates the record in the database', async function () {
      await DB.refresh();

      expect(DB.records().categories[index]).to.deep.equal(category.getData());
    });
  });
});
