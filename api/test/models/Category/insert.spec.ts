import { expect } from 'chai';
import { Category } from '../../../src/models/Category';
import { CategoryOperator } from '../../../src/models/Category/operator';
import { ICategoryData } from '../../../src/models/Category/types';
import { ModelStatus } from '../../../src/models/Entity/types';
import { getFixtureDatabaseClient } from '../../fixture/db';

const DB = getFixtureDatabaseClient();

describe('Insert a category', function () {
  const category_name = 'Test Insertion';

  before(async function () {
    await DB.init();
  });

  after(async function () {
    await DB.clear();
  });

  context('where a category with the same name does not exist in database', function () {
    const category = new Category();

    describe('# Arrange', function () {
      it('starts with no category in the database', async function () {
        const categories = await CategoryOperator.findAll();

        expect(categories.length).to.equal(0);
      });

      it('starts with an empty model', function () {
        expect(category.getID()).to.be.null;
        expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
        expect(category.getData()).to.be.null;
      });
    });

    describe('# Act', function () {
      it('initializes the model', function () {
        category.setData({ name: category_name });

        expect(category.getID()).to.be.null;
        expect(category.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(category.getData()).to.containSubset({
          name: category_name,
          description: null,
        });
      });

      it('executes successfully', async function () {
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
      let categories: Array<Partial<ICategoryData>> = [];

      before(async function () {
        categories = await CategoryOperator.findAll();
      });

      it('updates the model', function () {
        expect(category.getStatus()).to.equal(ModelStatus.PRISTINE);
      });

      it('inserts one record to the database', function () {
        expect(categories.length).to.equal(1);
      });

      it('assigns record ID to the inserted record', function () {
        expect(category.getID()).to.be.a.string;
      });

      it('inserts the record as-is', function () {
        expect(categories[0]).to.deep.equal(category.getData());
      });
    });
  });

  context('where a category with the same name already exists in database', function () {
    const category = new Category();

    describe('# Arrange', function () {
      let categories: Array<Partial<ICategoryData>> = [];

      before(async function () {
        categories = await CategoryOperator.findAll();
      });

      it('starts with an existing category in the database', function () {
        expect(categories.length).to.equal(1);
      });

      it('starts with the existing category having the same name', function () {
        expect(categories[0].name).to.equal(category_name);
      });

      it('starts with an empty model', function () {
        expect(category.getID()).to.be.null;
        expect(category.getStatus()).to.equal(ModelStatus.EMPTY);
        expect(category.getData()).to.be.null;
      });
    });

    describe('# Act', function () {
      it('initializes the model', function () {
        category.setData({ name: category_name });

        expect(category.getID()).to.be.null;
        expect(category.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(category.getData()).to.containSubset({
          name: category_name,
          description: null,
        });
      });

      it('throws an error', async function () {
        let error: Error | null = null;
        try {
          await category.save();
        } catch (e) {
          error = e as Error;
        }

        expect(error).not.to.be.null;
      });
    });

    describe('# Assert', function () {
      it('does not update the model', function () {
        expect(category.getStatus()).to.equal(ModelStatus.DIRTY);
        expect(category.getID()).to.be.null;
      });

      it('does not insert any record to the database', async function () {
        const categories = await CategoryOperator.findAll();

        expect(categories.length).to.equal(1);
      });
    });
  });
});
