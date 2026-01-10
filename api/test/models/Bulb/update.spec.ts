import { expect } from 'chai';
import { Bulb } from '../../../src/models/Bulb';
import { Category } from '../../../src/models/Category';
import { ModelStatus } from '../../../src/models/Entity/types';
import { ReferenceSource } from '../../../src/models/ReferenceSource';
import { Tag } from '../../../src/models/Tag';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Update a bulb', function () {
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

  describe('Case #1: Edit, add reference, add tag', function () {
    const bulb_index = 0;
    const category_index = 3;
    const reference_source_index = 0;
    const tag_index = 2;
    const category = new Category();
    const reference_source = new ReferenceSource();
    const tag = new Tag();
    const bulb = new Bulb();

    describe('# Arrange', function () {
      it('starts with a loaded model', async function () {
        const bulb_record = DB.records().bulbs[bulb_index];

        await bulb.load(bulb_record.id);

        expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(bulb.getData()).to.deep.equal(bulb_record);
      });

      it('starts with a category to be added', async function () {
        const category_record = DB.records().categories[category_index];

        await category.load(category_record.id);

        expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(category.getData()).to.deep.equal(category_record);
      });

      it('starts with a reference source to be added', async function () {
        const reference_source_record = DB.records().reference_sources[reference_source_index];

        await reference_source.load(reference_source_record.id);

        expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(reference_source.getData()).to.deep.equal(reference_source_record);
      });

      it('starts with a tag to be added', async function () {
        const tag_record = DB.records().tags[tag_index];

        await tag.load(tag_record.id);

        expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(tag.getData()).to.deep.equal(tag_record);
      });
    });

    describe('# Act', function () {
      it('edits the data', function () {
        const input = { title: 'New title', content: 'New content' };
        bulb.setData({
          ...input,
          category,
        });

        expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(bulb.getData()).to.containSubset({
          ...input,
          category: { id: category.getID() },
        });
      });

      it('adds a reference', function () {
        const reference = { source: reference_source, detail: 'Classic book' };
        bulb.addReference(reference);

        expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(bulb.getData()).to.containSubset({
          references: [
            {
              ...reference,
              source: { id: reference_source.getID() },
            },
          ],
        });
      });

      it('adds a tag', function () {
        bulb.addTag(tag);

        expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(bulb.getData()).to.containSubset({ tags: [{ id: tag.getID() }] });
      });

      it('saves successfully', async function () {
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
      it('updates the model', function () {
        expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('updates the record in the database', async function () {
        await DB.refresh();

        expect(DB.records().bulbs[bulb_index]).to.deep.equal(bulb.getData());
      });
    });
  });

  describe('Case #2: Archive content, remove reference, remove tag', function () {
    const bulb_index = 1;
    const reference_source = new ReferenceSource();
    const tag = new Tag();
    const bulb = new Bulb();

    describe('# Arrange', function () {
      it('starts with a loaded model', async function () {
        const bulb_record = DB.records().bulbs[bulb_index];

        await bulb.load(bulb_record.id);

        expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(bulb.getData()).to.deep.equal(bulb_record);
      });

      it('starts with a reference source to be removed', async function () {
        await reference_source.load(DB.records().bulbs[bulb_index].references[0].source.id);

        expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(reference_source.getData()).is.not.null;
        expect(reference_source.getID()).is.not.null;
      });

      it('starts with a tag to be removed', async function () {
        await tag.load(DB.records().bulbs[bulb_index].tags[0].id);

        expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(tag.getData()).is.not.null;
        expect(tag.getID()).is.not.null;
      });
    });

    describe('# Act', function () {
      it('archives the content', function () {
        const new_content = 'New content replacement';
        const old_content = bulb.getData()?.content;
        bulb.archiveCurrentVersion().setData({ content: new_content });

        expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(bulb.getData()).to.containSubset({
          content: new_content,
          past_versions: [{ content: old_content }],
        });
      });

      it('removes a reference', function () {
        bulb.removeReference(reference_source);

        expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(bulb.getData()?.references).to.deep.equal([]);
      });

      it('removes a tag', function () {
        bulb.removeTag(tag);

        expect(bulb.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(bulb.getData()?.tags).to.deep.equal([]);
      });

      it('saves successfully', async function () {
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
      it('updates the model', function () {
        expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('updates the record in the database', async function () {
        await DB.refresh();

        expect(DB.records().bulbs[bulb_index]).to.deep.equal(bulb.getData());
      });
    });
  });
});
