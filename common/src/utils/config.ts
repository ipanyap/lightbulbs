import { ValidateFunction } from 'ajv';
import fs from 'fs';
import { AppError } from '../error';

/**
 * The global object containing records of loaded config.
 */
const config_records: Record<string, { source: string; config: object }> = {};

/**
 * Loads config from a JSON file.
 * @param input.name The name and identifier of the config.
 * @param input.source The location of JSON file to load the config from.
 * @param input.force_reload (Optional) If true, will always load and overwrite previously loaded config.
 * @param input.validate (Optional) AJV validator for the config schema. If not provided, the config will not be validated.
 * @returns The loaded config.
 */
export function loadConfigFromJSONFile<ConfigType extends object>(input: {
  name: string;
  source: string;
  force_reload?: boolean;
  validate?: ValidateFunction<ConfigType>;
}): ConfigType {
  const { name, source, force_reload = false, validate } = input;

  /**
   * If config has been loaded previously and force_reload is off, return the existing config.
   */
  const config_record = config_records[name];

  if (config_record && source === config_record.source && !force_reload && config_record.config !== null) {
    return config_record.config as ConfigType;
  }

  /**
   * If the config file exists, load and parse.
   */
  if (!fs.existsSync(source)) {
    throw new AppError(`Config file for "${name}" is not found at ${source}`);
  }

  const raw_config = fs.readFileSync(source, 'utf8');

  const config = JSON.parse(raw_config);

  /**
   * If validation function is provided, validate the loaded config.
   */
  if (validate) {
    if (validate(config) === false) {
      throw new AppError(`Loaded config for "${name}" is invalid. Errors: ${JSON.stringify(validate.errors)}`);
    }
  }

  /**
   * Store the config and return it.
   */
  config_records[name] = { source, config };

  return config;
}
