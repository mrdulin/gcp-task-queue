import { ILogMethods } from 'dl-toolkits';
import { inject, injectable } from 'inversify';
import { ServiceIdentifierManager } from '../ioc/ServiceIdentifierManager';

interface IApplicationConfig {
  load(): Promise<IConfig>;
}

interface IConfig {
  NODE_ENV: string;
  [name: string]: string;
}

@injectable()
class ApplicationConfig implements IApplicationConfig {
  private logger: ILogMethods;
  private defaultConfig: IConfig = {
    NODE_ENV: '',
  };
  constructor(@inject(ServiceIdentifierManager.Logger) logger: ILogMethods) {
    this.logger = logger;
  }

  public async load(): Promise<IConfig> {
    if (process.env.NODE_ENV !== 'production') {
      const dotenv = await import('dotenv');
      const dotenvConfigOutput = dotenv.config();
      if (dotenvConfigOutput.error) {
        this.logger.error(dotenvConfigOutput.error, { context: 'ApplicationConfig.load' });
        throw dotenvConfigOutput.error;
      }
      return Object.assign({}, this.defaultConfig, dotenvConfigOutput.parsed);
    }
    return Object.assign({}, this.defaultConfig, process.env);
  }
}

export { ApplicationConfig, IApplicationConfig, IConfig };
