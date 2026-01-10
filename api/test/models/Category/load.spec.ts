import { expect } from 'chai';
import { Category } from '../../../src/models/Category';
import { ModelStatus } from '../../../src/models/Entity/types';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Load a category', function () {
  before(async function () {
    await DB.init();
    await DB.populate([FixtureEntityType.CATEGORY]);
  });

  after(async function () {
    await DB.clear();
  });

  describe('via .load()', function () {
    context('which exists in database', function () {
      const category = new Category();

      context('where the model has not been used since it is created', function () {
        const index = 0;

        describe('# Arrange', function () {
          it('starts with an empty model', function () {
            expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(category.getData()).to.be.null;
            expect(category.getID()).to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await category.load(DB.records().categories[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(category.getData()).to.deep.equal(DB.records().categories[index]);
          });
        });
      });

      context('where the model has just been used to load another category', function () {
        const index = 1;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(category.getData()).not.to.be.null;
            expect(category.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await category.load(DB.records().categories[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('overwrites the model with the newly loaded record', function () {
            expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(category.getData()).to.deep.equal(DB.records().categories[index]);
          });
        });
      });

      context('where the model has been cleared from previous use', function () {
        const index = 2;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(category.getData()).not.to.be.null;
            expect(category.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('clears the model', function () {
            category.clear();

            expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(category.getData()).to.be.null;
            expect(category.getID()).to.be.null;
          });

          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await category.load(DB.records().categories[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(category.getData()).to.deep.equal(DB.records().categories[index]);
          });
        });
      });
    });

    context('which does not exist in database', function () {
      const category = new Category();

      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(category.getData()).to.be.null;
          expect(category.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws a "Documents not found!" error', async function () {
          const non_existing_id = '41224d776a326fb40f000001';

          let error: Error | null = null;
          try {
            await category.load(non_existing_id);
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
          expect(error?.message).to.equal('Documents not found!');
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(category.getData()).to.be.null;
          expect(category.getID()).to.be.null;
        });
      });
    });
  });

  describe('via .reload()', function () {
    const category = new Category();

    context('where the model has not loaded a category previously', function () {
      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(category.getData()).to.be.null;
          expect(category.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws an error', async function () {
          let error: Error | null = null;
          try {
            await category.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(category.getData()).to.be.null;
          expect(category.getID()).to.be.null;
        });
      });
    });

    context('where the model has loaded a category previously', function () {
      const index = 0;
      const same_category = new Category();

      before(async function () {
        const category_id = DB.records().categories[index].id;

        await category.load(category_id);
        await same_category.load(category_id);
      });

      describe('# Arrange', function () {
        it('starts with a loaded model', function () {
          expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(category.getData()).to.deep.equal(DB.records().categories[index]);
        });

        it('starts with the model being out of sync with the database record', async function () {
          await same_category.setData({ description: 'I am updating this model' }).save();

          expect(category.getID()).to.equal(same_category.getID());
          expect(category.getData()).not.to.deep.equal(same_category.getData());
        });
      });

      describe('# Act', function () {
        it('reloads successfully', async function () {
          let error: Error | null = null;
          try {
            await category.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).to.be.null;
        });
      });

      describe('# Assert', function () {
        it('updates the model with the latest record from database', function () {
          expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(category.getData()).to.deep.equal(same_category.getData());
          expect(category.getID()).to.equal(DB.records().categories[index].id);
        });
      });
    });
  });
});
