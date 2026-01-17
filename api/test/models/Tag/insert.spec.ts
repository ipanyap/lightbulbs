import { expect } from 'chai';
import { ModelStatus } from '../../../src/models/Entity/types';
import { Tag } from '../../../src/models/Tag';
import { TagOperator } from '../../../src/models/Tag/operator';
import { ITagData } from '../../../src/models/Tag/types';
import { getFixtureDatabaseClient } from '../../fixture/db';

const DB = getFixtureDatabaseClient();

describe('Insert a tag', function () {
  const parent_tag_label = 'Test Parent Insertion';
  const child_tag_label = 'Test Child Insertion';

  before(async function () {
    await DB.init();
  });

  after(async function () {
    await DB.clear();
  });

  context('where a tag with the same label does not exist in database', function () {
    context('and the tag is created without a parent', function () {
      const tag = new Tag();

      describe('# Arrange', function () {
        it('starts with no tag in the database', async function () {
          const tags = await TagOperator.findAll();

          expect(tags.length).to.equal(0);
        });

        it('starts with an empty model', function () {
          expect(tag.getID()).to.be.null;
          expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(tag.getData()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('initializes the model', function () {
          tag.setData({ label: parent_tag_label });

          expect(tag.getID()).to.be.null;
          expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
          expect(tag.getData()).to.containSubset({
            label: parent_tag_label,
            parent: null,
            description: null,
          });
        });

        it('executes successfully', async function () {
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
        let tags: Array<Partial<ITagData>> = [];

        before(async function () {
          tags = await TagOperator.findAll();
        });

        it('updates the model', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        });

        it('inserts one record to the database', function () {
          expect(tags.length).to.equal(1);
        });

        it('assigns record ID to the inserted record', function () {
          expect(tag.getID()).to.be.a.string;
        });

        it('inserts the record as-is', function () {
          expect(tags[0]).to.deep.equal(tag.getData());
        });
      });
    });

    context('and the tag is created as a child of another tag', function () {
      const tag = new Tag();
      const parent_tag = new Tag();

      describe('# Arrange', function () {
        it('starts with an existing tag in the database', async function () {
          const tags = await TagOperator.findAll();

          expect(tags.length).to.equal(1);

          await parent_tag.load(tags[0].id as string);

          expect(parent_tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        });

        it('starts with an empty model', function () {
          expect(tag.getID()).to.be.null;
          expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(tag.getData()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('initializes the model', function () {
          tag.setData({ label: child_tag_label }).linkTo(parent_tag);

          expect(tag.getID()).to.be.null;
          expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
          expect(tag.getData()).to.containSubset({
            label: child_tag_label,
            parent: {
              id: parent_tag.getID(),
            },
            description: null,
          });
        });

        it('executes successfully', async function () {
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
        let tags: Array<Partial<ITagData>> = [];

        before(async function () {
          tags = await TagOperator.findAll();
        });

        it('updates the model', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
        });

        it('inserts one record to the database', function () {
          expect(tags.length).to.equal(2);
        });

        it('assigns record ID to the inserted record', function () {
          expect(tag.getID()).to.be.a.string;
        });

        it('inserts the record as-is', function () {
          expect(tags[1]).to.deep.equal(tag.getData());
        });

        it('inserts the record as a child of the existing tag', function () {
          expect(tags[1].parent?.id).to.equal(tags[0].id);
        });
      });
    });
  });

  context('where a tag with the same label already exists in database', function () {
    const tag = new Tag();

    describe('# Arrange', function () {
      let tags: Array<Partial<ITagData>> = [];

      before(async function () {
        tags = await TagOperator.findAll();
      });

      it('starts with existing tags in the database', function () {
        expect(tags.length).to.equal(2);
      });

      it('starts with one of the existing tags having the same label', function () {
        expect(tags[0].label).to.equal(parent_tag_label);
      });

      it('starts with an empty model', function () {
        expect(tag.getID()).to.be.null;
        expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
        expect(tag.getData()).to.be.null;
      });
    });

    describe('# Act', function () {
      it('initializes the model', function () {
        tag.setData({ label: parent_tag_label });

        expect(tag.getID()).to.be.null;
        expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(tag.getData()).to.containSubset({
          label: parent_tag_label,
          parent: null,
          description: null,
        });
      });

      it('throws an error', async function () {
        let error: Error | null = null;
        try {
          await tag.save();
        } catch (e) {
          error = e as Error;
        }

        expect(error).not.to.be.null;
      });
    });

    describe('# Assert', function () {
      it('does not update the model', function () {
        expect(tag.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(tag.getID()).to.be.null;
      });

      it('does not insert any record to the database', async function () {
        const tags = await TagOperator.findAll();

        expect(tags.length).to.equal(2);
      });
    });
  });
});
