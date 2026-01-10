import { expect } from 'chai';
import { ModelStatus } from '../../../src/models/Entity/types';
import { ReferenceSource } from '../../../src/models/ReferenceSource';
import { getFixtureDatabaseClient } from '../../fixture/db';
import { FixtureEntityType } from '../../fixture/db/types';

const DB = getFixtureDatabaseClient();

describe('Load a reference source', function () {
  before(async function () {
    await DB.init();
    await DB.populate([FixtureEntityType.REFERENCE_SOURCE]);
  });

  after(async function () {
    await DB.clear();
  });

  describe('via .load()', function () {
    context('which exists in database', function () {
      const reference_source = new ReferenceSource();

      context('where the model has not been used since it is created', function () {
        const index = 0;

        describe('# Arrange', function () {
          it('starts with an empty model', function () {
            expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(reference_source.getData()).to.be.null;
            expect(reference_source.getID()).to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await reference_source.load(DB.records().reference_sources[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(reference_source.getData()).to.deep.equal(DB.records().reference_sources[index]);
          });
        });
      });

      context('where the model has just been used to load another reference source', function () {
        const index = 1;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(reference_source.getData()).not.to.be.null;
            expect(reference_source.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await reference_source.load(DB.records().reference_sources[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('overwrites the model with the newly loaded record', function () {
            expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(reference_source.getData()).to.deep.equal(DB.records().reference_sources[index]);
          });
        });
      });

      context('where the model has been cleared from previous use', function () {
        const index = 2;

        describe('# Arrange', function () {
          it('starts with a loaded model', function () {
            expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(reference_source.getData()).not.to.be.null;
            expect(reference_source.getID()).not.to.be.null;
          });
        });

        describe('# Act', function () {
          it('clears the model', function () {
            reference_source.clear();

            expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
            expect(reference_source.getData()).to.be.null;
            expect(reference_source.getID()).to.be.null;
          });

          it('loads successfully', async function () {
            let error: Error | null = null;
            try {
              await reference_source.load(DB.records().reference_sources[index].id);
            } catch (e) {
              error = e as Error;
            }

            expect(error).to.be.null;
          });
        });

        describe('# Assert', function () {
          it('fills the model with the newly loaded record', function () {
            expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
            expect(reference_source.getData()).to.deep.equal(DB.records().reference_sources[index]);
          });
        });
      });
    });

    context('which does not exist in database', function () {
      const reference_source = new ReferenceSource();

      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(reference_source.getData()).to.be.null;
          expect(reference_source.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws a "Documents not found!" error', async function () {
          const non_existing_id = '41224d776a326fb40f000001';

          let error: Error | null = null;
          try {
            await reference_source.load(non_existing_id);
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
          expect(error?.message).to.equal('Documents not found!');
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(reference_source.getData()).to.be.null;
          expect(reference_source.getID()).to.be.null;
        });
      });
    });
  });

  describe('via .reload()', function () {
    const reference_source = new ReferenceSource();

    context('where the model has not loaded a reference source previously', function () {
      describe('# Arrange', function () {
        it('starts with an empty model', function () {
          expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(reference_source.getData()).to.be.null;
          expect(reference_source.getID()).to.be.null;
        });
      });

      describe('# Act', function () {
        it('throws an error', async function () {
          let error: Error | null = null;
          try {
            await reference_source.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).not.to.be.null;
        });
      });

      describe('# Assert', function () {
        it('does not fill the model with anything', function () {
          expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
          expect(reference_source.getData()).to.be.null;
          expect(reference_source.getID()).to.be.null;
        });
      });
    });

    context('where the model has loaded a reference source previously', function () {
      const index = 0;
      const same_reference_source = new ReferenceSource();

      before(async function () {
        const reference_source_id = DB.records().reference_sources[index].id;

        await reference_source.load(reference_source_id);
        await same_reference_source.load(reference_source_id);
      });

      describe('# Arrange', function () {
        it('starts with a loaded model', function () {
          expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(reference_source.getData()).to.deep.equal(DB.records().reference_sources[index]);
        });

        it('starts with the model being out of sync with the database record', async function () {
          await same_reference_source.setData({ description: 'I am updating this model' }).save();

          expect(reference_source.getID()).to.equal(same_reference_source.getID());
          expect(reference_source.getData()).not.to.deep.equal(same_reference_source.getData());
        });
      });

      describe('# Act', function () {
        it('reloads successfully', async function () {
          let error: Error | null = null;
          try {
            await reference_source.reload();
          } catch (e) {
            error = e as Error;
          }

          expect(error).to.be.null;
        });
      });

      describe('# Assert', function () {
        it('updates the model with the latest record from database', function () {
          expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
          expect(reference_source.getData()).to.deep.equal(same_reference_source.getData());
          expect(reference_source.getID()).to.equal(DB.records().reference_sources[index].id);
        });
      });
    });
  });
});
