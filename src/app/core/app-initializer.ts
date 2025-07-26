import { ConfigurationService } from './services/configuration.service';

import { AppConfig } from './models/app-config.interface';

export function initializeApp(configService: ConfigurationService) {
  return (): Promise<AppConfig> => {
    return configService.loadConfiguration();
  };
}
