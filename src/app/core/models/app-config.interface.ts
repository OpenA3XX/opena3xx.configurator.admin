export interface AppConfig {
  api: {
    baseUrl: string;
  };
  app: {
    name: string;
    version: string;
  };
  features: {
    enableDebugMode: boolean;
    enableConsoleLogging: boolean;
  };
}
