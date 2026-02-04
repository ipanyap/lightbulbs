import { expect } from 'chai';
import { ModelStatus } from '../../../src/models/Entity/types';
import { ReferenceSource } from '../../../src/models/ReferenceSource';
import { ReferenceSourceOperator } from '../../../src/models/ReferenceSource/operator';
import { IReferenceSourceData, ReferenceSourceType } from '../../../src/models/ReferenceSource/types';
import { getFixtureDatabaseClient } from '../../fixture/db';

const DB = getFixtureDatabaseClient();

describe('Insert a reference source', function () {
  const reference_source_name = 'Test Insertion';

  before(async function () {
    await DB.init();
  });

  after(async function () {
    await DB.clear();
  });

  context('where a reference source with the same name does not exist in database', function () {
    const reference_source = new ReferenceSource();

    describe('# Arrange', function () {
      it('starts with no reference source in the database', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll();

        expect(reference_sources.length).to.equal(0);
      });

      it('starts with an empty model', function () {
        expect(reference_source.getID()).to.be.null;
        expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
        expect(reference_source.getData()).to.be.null;
      });
    });

    describe('# Act', function () {
      it('initializes the model', function () {
        const reference_source_input = { name: reference_source_name, type: ReferenceSourceType.PRINT };

        reference_source.setData(reference_source_input);

        expect(reference_source.getID()).to.be.null;
        expect(reference_source.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(reference_source.getData()).to.containSubset({
          ...reference_source_input,
          locator: null,
          image_url: null,
          description: null,
        });
      });

      it('executes successfully', async function () {
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
      let reference_sources: Array<Partial<IReferenceSourceData>> = [];

      before(async function () {
        reference_sources = await ReferenceSourceOperator.findAll();
      });

      it('updates the model', function () {
        expect(reference_source.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('inserts one record to the database', function () {
        expect(reference_sources.length).to.equal(1);
      });

      it('assigns record ID to the inserted record', function () {
        expect(reference_source.getID()).to.be.a.string;
      });

      it('inserts the record as-is', function () {
        expect(reference_sources[0]).to.deep.equal(reference_source.getData());
      });
    });
  });

  context('where a reference source with the same name already exists in database', function () {
    const reference_source = new ReferenceSource();

    describe('# Arrange', function () {
      let reference_sources: Array<Partial<IReferenceSourceData>> = [];

      before(async function () {
        reference_sources = await ReferenceSourceOperator.findAll();
      });

      it('starts with an existing reference source in the database', function () {
        expect(reference_sources.length).to.equal(1);
      });

      it('starts with the existing reference source having the same name', function () {
        expect(reference_sources[0].name).to.equal(reference_source_name);
      });

      it('starts with an empty model', function () {
        expect(reference_source.getID()).to.be.null;
        expect(reference_source.getStatus()).to.equal(ModelStatus.EMPTY);
        expect(reference_source.getData()).to.be.null;
      });
    });

    describe('# Act', function () {
      it('initializes the model', function () {
        const reference_source_input = { name: reference_source_name, type: ReferenceSourceType.MUSIC };

        reference_source.setData(reference_source_input);

        expect(reference_source.getID()).to.be.null;
        expect(reference_source.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(reference_source.getData()).to.containSubset({
          ...reference_source_input,
          locator: null,
          image_url: null,
          description: null,
        });
      });

      it('throws an error', async function () {
        let error: Error | null = null;
        try {
          await reference_source.save();
        } catch (e) {
          error = e as Error;
        }

        expect(error).not.to.be.null;
      });
    });

    describe('# Assert', function () {
      it('does not update the model', function () {
        expect(reference_source.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(reference_source.getID()).to.be.null;
      });

      it('does not insert any record to the database', async function () {
        const reference_sources = await ReferenceSourceOperator.findAll();

        expect(reference_sources.length).to.equal(1);
      });
    });
  });
});
