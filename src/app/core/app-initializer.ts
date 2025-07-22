import { ConfigurationService } from './services/configuration.service';

export function initializeApp(configService: ConfigurationService) {
  return (): Promise<any> => {
    return configService.loadConfiguration();
  };
}
