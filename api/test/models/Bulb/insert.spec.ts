import { expect } from 'chai';
import { Bulb } from '../../../src/models/Bulb';
import { BulbOperator } from '../../../src/models/Bulb/operator';
import { IBulbData } from '../../../src/models/Bulb/types';
import { Category } from '../../../src/models/Category';
import { ModelStatus } from '../../../src/models/Entity/types';
import { ReferenceSource } from '../../../src/models/ReferenceSource';
import { Tag } from '../../../src/models/Tag';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Insert a bulb', function () {
  const bulb_basic_input = { title: 'Test Insertion', content: 'Hi this is my first bulb!' };

  before(async function () {
    await DB.init([FixtureEntityType.CATEGORY, FixtureEntityType.REFERENCE_SOURCE, FixtureEntityType.TAG]);
  });

  after(async function () {
    await DB.clear();
  });

  const bulb = new Bulb();
  const category = new Category();
  const reference_source = new ReferenceSource();
  const tag = new Tag();

  describe('# Arrange', function () {
    it('starts with no bulb in the database', async function () {
      const bulbs = await BulbOperator.findAll();

      expect(bulbs.length).to.equal(0);
    });

    it('starts with an empty model', function () {
      expect(bulb.getID()).to.be.null;
      expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
      expect(bulb.getData()).to.be.null;
    });

    it('starts with an existing category', async function () {
      await category.load(DB.records().categories[0].id);

      expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
    });

    it('starts with an existing reference source', async function () {
      await reference_source.load(DB.records().reference_sources[0].id);

      expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
    });

    it('starts with an existing tag', async function () {
      await tag.load(DB.records().tags[0].id);

      expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
    });
  });

  describe('# Act', function () {
    it('initializes the model', function () {
      bulb.setData({
        ...bulb_basic_input,
        category,
      });

      expect(bulb.getID()).to.be.null;
      expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(bulb.getData()).to.containSubset({
        ...bulb_basic_input,
        category: { id: category.getID() },
      });
    });

    it('adds a reference', function () {
      bulb.addReference({ source: reference_source, detail: null });

      expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(bulb.getData()).to.containSubset({
        references: [{ source: { id: reference_source.getID() }, detail: null }],
      });
    });

    it('adds a tag', function () {
      bulb.addTag(tag);

      expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
      expect(bulb.getData()).to.containSubset({
        tags: [{ id: tag.getID() }],
      });
    });

    it('executes successfully', async function () {
      let error: Error | null = null;
      try {
        await bulb.save();
      } catch (e) {
        error = e as Error;
      }

      expect(error).to.be.null;
    });
  });

  describe('# Assert', function () {
    let bulbs: Array<Partial<IBulbData>> = [];

    before(async function () {
      bulbs = await BulbOperator.findAll();
    });

    it('updates the model', function () {
      expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
    });

    it('inserts one record to the database', function () {
      expect(bulbs.length).to.equal(1);
    });

    it('assigns record ID to the inserted record', function () {
      expect(bulb.getID()).to.be.a.string;
    });

    it('inserts the record as-is', function () {
      expect(bulbs[0]).to.deep.equal(bulb.getData());
    });
  });
});
