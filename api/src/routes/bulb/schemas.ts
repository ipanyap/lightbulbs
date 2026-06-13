import { IWorkflowJSONSchema } from '../../common/route/types';
import { IAddBulbInput } from '../../workflows/add/bulb';
import { IEditBulbInput } from '../../workflows/edit/bulb';

/**
 * JSON schema for addBulb input
 */
export const ADD_BULB_INPUT_SCHEMA: IWorkflowJSONSchema<IAddBulbInput> = {
  data: {
    type: 'object',
    required: ['title', 'category', 'content'],
    additionalProperties: false,
    properties: {
      title: { type: 'string' },
      category: {
        type: 'object',
        required: ['id'],
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
        },
      },
      content: { type: 'string' },
      references: {
        type: 'array',
        items: {
          type: 'object',
          required: ['source', 'detail'],
          properties: {
            source: {
              type: 'object',
              required: ['id'],
              properties: {
                id: { type: 'string' },
              },
            },
            detail: { oneOf: [{ type: 'string' }, { type: 'null', nullable: true }] },
          },
        },
        default: [],
      },
      tags: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        default: [],
      },
    },
  },
};

/**
 * JSON schema for editBulb input
 */
export const EDIT_BULB_INPUT_SCHEMA: IWorkflowJSONSchema<IEditBulbInput> = {
  key: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
    },
  },
  data: {
    type: 'object',
    required: [],
    additionalProperties: false,
    properties: {
      title: { type: 'string', nullable: true },
      content: { type: 'string', nullable: true },
    },
    anyOf: [{ required: ['title'] }, { required: ['content'] }],
  },
};
