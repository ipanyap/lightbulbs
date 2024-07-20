import AJV, { JSONSchemaType } from 'ajv';
import path from 'path';
import { loadConfigFromJSONFile } from '@lightbulbs/common';

const API_SERVER_ENV = 'api::env';

/**
 * The environment config type.
 */
export interface IEnvironmentConfig {
  db: {
    host: string;
    port: string;
    database: string;
    user: string;
    password: string;
  };
}

/**
 * JSON Schema representation of the environment config type.
 */
const schema: JSONSchemaType<IEnvironmentConfig> = {
  type: 'object',
  required: ['db'],
  properties: {
    db: {
      type: 'object',
      required: ['host', 'port', 'database', 'user', 'password'],
      properties: {
        host: { type: 'string' },
        port: { type: 'string' },
        database: { type: 'string' },
        user: { type: 'string' },
        password: { type: 'string' },
      },
    },
  },
};

/**
 * Validator function based on the JSON Schema type, powered by AJV.
 */
const ajv = new AJV();
const validate = ajv.compile(schema);

/**
 * Retrieves the environment config.
 * @param options.file_path (Optional) The file to load the env config, default to `env.json` in the workspace root
 * @param options.force_reload (Optional) Whether to reload when the env config is found in memory
 * @returns The environment config
 */
export function getEnvConfig(options: { file_path?: string; force_reload?: boolean } = {}): IEnvironmentConfig {
  const { file_path, force_reload = false } = options;

  /**
   * Resolve env source's absolute path
   */
  let source = '';
  if (file_path) {
    // resolve custom file_path based on the caller's path
    const caller_directory = path.dirname(require.main?.filename as string);
    source = path.resolve(caller_directory, file_path);
  } else {
    // use the app's root directory
    source = path.resolve(process.cwd(), 'env.json');
  }

  return loadConfigFromJSONFile({
    name: API_SERVER_ENV,
    source,
    force_reload,
    validate,
  });
}
