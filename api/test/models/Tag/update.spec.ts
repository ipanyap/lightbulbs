import { expect } from 'chai';
import { ModelStatus } from '../../../src/models/Entity/types';
import { Tag } from '../../../src/models/Tag';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Update a tag', function () {
  before(async function () {
    await DB.init();
    await DB.populate([FixtureEntityType.TAG]);
  });

  after(async function () {
    await DB.clear();
  });

  describe('Case #1: Normal edit', function () {
    const index = 4;
    const tag = new Tag();

    describe('# Arrange', function () {
      it('starts with a loaded model', async function () {
        const tag_record = DB.records().tags[index];

        await tag.load(tag_record.id);

        expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(tag.getData()).to.deep.equal(tag_record);
      });
    });

    describe('# Act', function () {
      it('edits the data', function () {
        const input = { label: 'New name', description: 'New description' };
        tag.setData(input);

        expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(tag.getData()).to.containSubset(input);
      });

      it('increases total bulbs twice', function () {
        tag.increaseTotalBulbs().increaseTotalBulbs();

        expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(tag.getData()).to.containSubset({ statistics: { total_bulbs: 2 } });
      });

      it('decreases total bulbs once', function () {
        tag.decreaseTotalBulbs();

        expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(tag.getData()).to.containSubset({ statistics: { total_bulbs: 1 } });
      });

      it('saves successfully', async function () {
        let error: Error | null = null;
        try {
          await tag.save();
        } catch (e) {
          error = e as Error;
        }

        expect(error).to.be.null;
      });
    });

    describe('# Assert', function () {
      it('updates the model', function () {
        expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('updates the record in the database', async function () {
        await DB.refresh();

        expect(DB.records().tags[index]).to.deep.equal(tag.getData());
      });
    });
  });

  describe('Case #2: Establish parent-child relationship', function () {
    const child_index = 2;
    const parent_index = 0;
    const child_tag = new Tag();
    const parent_tag = new Tag();

    describe('# Arrange', function () {
      it('starts with a loaded model with no parent', async function () {
        const child_tag_record = DB.records().tags[child_index];

        await child_tag.load(child_tag_record.id);

        expect(child_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(child_tag.getData()).to.deep.equal(child_tag_record);
        expect(child_tag.getData()?.parent).to.equal(null);
      });

      it('starts with a loaded model with no children', async function () {
        const parent_tag_record = DB.records().tags[parent_index];

        await parent_tag.load(parent_tag_record.id);

        expect(parent_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(parent_tag.getData()).to.deep.equal(parent_tag_record);
        expect(parent_tag.getData()?.statistics.total_children).to.equal(0);
      });
    });

    describe('# Act', function () {
      it('links the child to the parent', function () {
        child_tag.linkTo(parent_tag);

        expect(child_tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(child_tag.getData()?.parent?.id).to.equal(parent_tag.getID());
      });

      it('increases total children of the parent', function () {
        parent_tag.increaseTotalChildren();

        expect(parent_tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(parent_tag.getData()?.statistics.total_children).to.equal(1);
      });

      it('saves successfully', async function () {
        let error: Error | null = null;
        try {
          await child_tag.save();
          await parent_tag.save();
        } catch (e) {
          error = e as Error;
        }

        expect(error).to.be.null;
      });
    });

    describe('# Assert', function () {
      before(async function () {
        await DB.refresh();
      });

      it('updates the models', function () {
        expect(child_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(parent_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('updates the records in the database', function () {
        expect(DB.records().tags[child_index]).to.deep.equal(child_tag.getData());
        expect(DB.records().tags[parent_index]).to.deep.equal(parent_tag.getData());
      });

      it('updates the child tag to refer to parent tag in the database', function () {
        expect(DB.records().tags[child_index].parent?.id).to.equal(parent_tag.getID());
      });

      it('updates the total children of the parent tag in the database', function () {
        expect(DB.records().tags[parent_index].statistics.total_children).to.equal(1);
      });
    });
  });

  describe('Case #3: Sever parent-child relationship', function () {
    const child_index = 3;
    const parent_index = 1;
    const child_tag = new Tag();
    const parent_tag = new Tag();

    describe('# Arrange', function () {
      it('starts with a loaded parent model', async function () {
        const parent_tag_record = DB.records().tags[parent_index];

        await parent_tag.load(parent_tag_record.id);

        expect(parent_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(parent_tag.getData()).to.deep.equal(parent_tag_record);
        expect(parent_tag.getData()?.statistics.total_children).to.equal(1);
      });

      it('starts with a loaded child model', async function () {
        const child_tag_record = DB.records().tags[child_index];

        await child_tag.load(child_tag_record.id);

        expect(child_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(child_tag.getData()).to.deep.equal(child_tag_record);
        expect(child_tag.getData()?.parent?.id).to.equal(parent_tag.getID());
      });
    });

    describe('# Act', function () {
      it('links the child to null', function () {
        child_tag.linkTo(null);

        expect(child_tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(child_tag.getData()?.parent).to.equal(null);
      });

      it('decreases total children of the parent', function () {
        parent_tag.decreaseTotalChildren();

        expect(parent_tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(parent_tag.getData()?.statistics.total_children).to.equal(0);
      });

      it('saves successfully', async function () {
        let error: Error | null = null;
        try {
          await child_tag.save();
          await parent_tag.save();
        } catch (e) {
          error = e as Error;
        }

        expect(error).to.be.null;
      });
    });

    describe('# Assert', function () {
      before(async function () {
        await DB.refresh();
      });

      it('updates the models', function () {
        expect(child_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        expect(parent_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('updates the records in the database', function () {
        expect(DB.records().tags[child_index]).to.deep.equal(child_tag.getData());
        expect(DB.records().tags[parent_index]).to.deep.equal(parent_tag.getData());
      });

      it('updates the child tag to refer to no parent in the database', function () {
        expect(DB.records().tags[child_index].parent).to.equal(null);
      });

      it('updates the total children of the parent tag in the database', function () {
        expect(DB.records().tags[parent_index].statistics.total_children).to.equal(0);
      });
    });
  });
});
