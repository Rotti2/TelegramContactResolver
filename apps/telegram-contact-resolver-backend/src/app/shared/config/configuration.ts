import * as yaml from 'js-yaml';
import { join } from 'path';
import * as fs from 'fs';
import { environment } from '../../../environments/environment';
import { Logger } from '@nestjs/common';

const YAML_CONFIG_FILENAME = 'appsettings.yaml';
const YAML_DEVELOPMENT_CONFIG_FILENAME = 'appsettings.development.yaml';

export default (): Record<string, string> => {
  if (!environment.production && fs.existsSync(join(__dirname, 'config', YAML_DEVELOPMENT_CONFIG_FILENAME))) {
    Logger.log('Using Dev Configuration', 'Configuration');
    return yaml.load(
      fs.readFileSync(join(__dirname, 'config', YAML_DEVELOPMENT_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, string>;
  } else {
    Logger.log('Using Prod Configuration', 'Configuration');
    return yaml.load(
      fs.readFileSync(join(__dirname, 'config', YAML_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, string>;
  }
};
