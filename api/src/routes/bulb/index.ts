import { Router } from 'express';
import { buildRoute } from '../../common/route';
import { HTTPMethod } from '../../common/route/types';
import { addBulb, IAddBulbInput } from '../../workflows/add/bulb';
import { editBulb, IEditBulbInput } from '../../workflows/edit/bulb';
import { fetchBulb, IFetchBulbInput } from '../../workflows/fetch/bulb';
import { findBulbs } from '../../workflows/find/bulbs';
import { ADD_BULB_INPUT_SCHEMA, EDIT_BULB_INPUT_SCHEMA } from './schemas';

// Provide and export the router
export const router = Router();

/**
 * GET /bulb/
 */
buildRoute(router, {
  path: '/',
  method: HTTPMethod.GET,
  workflow: findBulbs,
});

/**
 * POST /bulb/
 */
buildRoute<IAddBulbInput>(router, {
  path: '/',
  method: HTTPMethod.POST,
  workflow: addBulb,
  schema: ADD_BULB_INPUT_SCHEMA,
});

/**
 * GET /bulb/:id
 */
buildRoute<IFetchBulbInput>(router, {
  path: '/:id',
  method: HTTPMethod.GET,
  workflow: fetchBulb,
});

/**
 * PATCH /bulb/:id
 */
buildRoute<IEditBulbInput>(router, {
  path: '/:id',
  method: HTTPMethod.PATCH,
  workflow: editBulb,
  schema: EDIT_BULB_INPUT_SCHEMA,
});
