import { expect } from 'chai';
import { Bulb } from '../../../src/models/Bulb';
import { ModelStatus } from '../../../src/models/Entity/types';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Load a bulb', function () {
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

  describe('via .load()', function () {
    context('which exists in database', function () {
      const bulb = new Bulb();

      context('where the model has not been used since it is created', function () {
        const index = 0;

        describe('# Arrange', function () {
          it('starts with an empty model', function () {
            expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(bulb.getData()).to.be.null;
            expect(bulb.getID()).to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await bulb.load(DB.records().bulbs[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(bulb.getData()).to.deep.equal(DB.records().bulbs[index]);
          });
        });
      });

      context('where the model has just been used to load another bulb', function () {
        const index = 1;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(bulb.getData()).not.to.be.null;
            expect(bulb.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await bulb.load(DB.records().bulbs[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('overwrites the model with the newly loaded record', function () {
            expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(bulb.getData()).to.deep.equal(DB.records().bulbs[index]);
          });
        });
      });

      context('where the model has been cleared from previous use', function () {
        const index = 2;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(bulb.getData()).not.to.be.null;
            expect(bulb.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('clears the model', function () {
            bulb.clear();

            expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(bulb.getData()).to.be.null;
            expect(bulb.getID()).to.be.null;
          });

          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await bulb.load(DB.records().bulbs[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(bulb.getData()).to.deep.equal(DB.records().bulbs[index]);
          });
        });
      });
    });

    context('which does not exist in database', function () {
      const bulb = new Bulb();

      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(bulb.getData()).to.be.null;
          expect(bulb.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws a "Documents not found!" error', async function () {
          const non_existing_id = '41224d776a326fb40f000001';

          let error: Error | null = null;
          try {
            await bulb.load(non_existing_id);
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
          expect(error?.message).to.equal('Documents not found!');
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(bulb.getData()).to.be.null;
          expect(bulb.getID()).to.be.null;
        });
      });
    });
  });

  describe('via .reload()', function () {
    const bulb = new Bulb();

    context('where the model has not loaded a bulb previously', function () {
      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(bulb.getData()).to.be.null;
          expect(bulb.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws an error', async function () {
          let error: Error | null = null;
          try {
            await bulb.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(bulb.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(bulb.getData()).to.be.null;
          expect(bulb.getID()).to.be.null;
        });
      });
    });

    context('where the model has loaded a bulb previously', function () {
      const index = 0;
      const same_bulb = new Bulb();

      before(async function () {
        const bulb_id = DB.records().bulbs[index].id;

        await bulb.load(bulb_id);
        await same_bulb.load(bulb_id);
      });

      describe('# Arrange', function () {
        it('starts with a loaded model', function () {
          expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(bulb.getData()).to.deep.equal(DB.records().bulbs[index]);
        });

        it('starts with the model being out of sync with the database record', async function () {
          await same_bulb.setData({ content: 'I am updating this model' }).save();

          expect(bulb.getID()).to.equal(same_bulb.getID());
          expect(bulb.getData()).not.to.deep.equal(same_bulb.getData());
        });
      });

      describe('# Act', function () {
        it('reloads successfully', async function () {
          let error: Error | null = null;
          try {
            await bulb.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).to.be.null;
        });
      });

      describe('# Assert', function () {
        it('updates the model with the latest record from database', function () {
          expect(bulb.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(bulb.getData()).to.deep.equal(same_bulb.getData());
          expect(bulb.getID()).to.equal(DB.records().bulbs[index].id);
        });
      });
    });
  });
});
