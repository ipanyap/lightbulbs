import { expect } from 'chai';
import { ModelStatus } from '../../../src/models/Entity/types';
import { Tag } from '../../../src/models/Tag';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Load a tag', function () {
  before(async function () {
    await DB.init([FixtureEntityType.TAG]);
  });

  after(async function () {
    await DB.clear();
  });

  describe('via .load()', function () {
    context('which exists in database', function () {
      const tag = new Tag();

      context('where the model has not been used since it is created', function () {
        const index = 0;

        describe('# Arrange', function () {
          it('starts with an empty model', function () {
            expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(tag.getData()).to.be.null;
            expect(tag.getID()).to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await tag.load(DB.records().tags[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(tag.getData()).to.deep.equal(DB.records().tags[index]);
          });
        });
      });

      context('where the model has just been used to load another tag', function () {
        const index = 1;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(tag.getData()).not.to.be.null;
            expect(tag.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await tag.load(DB.records().tags[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('overwrites the model with the newly loaded record', function () {
            expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(tag.getData()).to.deep.equal(DB.records().tags[index]);
          });
        });
      });

      context('where the model has been cleared from previous use', function () {
        const index = 2;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(tag.getData()).not.to.be.null;
            expect(tag.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('clears the model', function () {
            tag.clear();

            expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(tag.getData()).to.be.null;
            expect(tag.getID()).to.be.null;
          });

          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await tag.load(DB.records().tags[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(tag.getData()).to.deep.equal(DB.records().tags[index]);
          });
        });
      });
    });

    context('which does not exist in database', function () {
      const tag = new Tag();

      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(tag.getData()).to.be.null;
          expect(tag.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws a "Documents not found!" error', async function () {
          const non_existing_id = '41224d776a326fb40f000001';

          let error: Error | null = null;
          try {
            await tag.load(non_existing_id);
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
          expect(error?.message).to.equal('Documents not found!');
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(tag.getData()).to.be.null;
          expect(tag.getID()).to.be.null;
        });
      });
    });
  });

  describe('via .reload()', function () {
    const tag = new Tag();

    context('where the model has not loaded a tag previously', function () {
      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(tag.getData()).to.be.null;
          expect(tag.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws an error', async function () {
          let error: Error | null = null;
          try {
            await tag.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(tag.getData()).to.be.null;
          expect(tag.getID()).to.be.null;
        });
      });
    });

    context('where the model has loaded a tag previously', function () {
      const index = 0;
      const same_tag = new Tag();

      before(async function () {
        const tag_id = DB.records().tags[index].id;

        await tag.load(tag_id);
        await same_tag.load(tag_id);
      });

      describe('# Arrange', function () {
        it('starts with a loaded model', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(tag.getData()).to.deep.equal(DB.records().tags[index]);
        });

        it('starts with the model being out of sync with the database record', async function () {
          await same_tag.setData({ description: 'I am updating this model' }).save();

          expect(tag.getID()).to.equal(same_tag.getID());
          expect(tag.getData()).not.to.deep.equal(same_tag.getData());
        });
      });

      describe('# Act', function () {
        it('reloads successfully', async function () {
          let error: Error | null = null;
          try {
            await tag.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).to.be.null;
        });
      });

      describe('# Assert', function () {
        it('updates the model with the latest record from database', function () {
          expect(tag.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(tag.getData()).to.deep.equal(same_tag.getData());
          expect(tag.getID()).to.equal(DB.records().tags[index].id);
        });
      });
    });
  });
});
