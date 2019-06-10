import { ILogMethods } from 'dl-toolkits';
import { DotenvConfigOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import path from 'path';
import { ServiceIdentifierManager } from '../ioc/ServiceIdentifierManager';

interface IApplicationConfig {
  load(filename?: string): Promise<IConfig>;
}

interface IConfig {
  NODE_ENV: string;
  PROJECT_ID: string;
  PUBSUB_ADMIN_CREDENTIAL: string;
  TASK_QUEUE_NAME: string;
  [name: string]: string;
}

type ApplicationConfigProvider = () => Promise<IConfig>;

@injectable()
class ApplicationConfig implements IApplicationConfig {
  private logger: ILogMethods;
  private defaultConfig: IConfig = {
    NODE_ENV: '',
    PROJECT_ID: '',
    PUBSUB_ADMIN_CREDENTIAL: './.gcp',
    TASK_QUEUE_NAME: '',
  };
  private config!: IConfig;
  constructor(@inject(ServiceIdentifierManager.Logger) logger: ILogMethods) {
    this.logger = logger;
  }

  public async load(filename?: string): Promise<IConfig> {
    if (this.config) {
      return this.config;
    }
    if (process.env.NODE_ENV !== 'production') {
      const dotenv = await import('dotenv');
      const envFile: string = filename ? filename : '.env';
      const dotenvConfigOutput: DotenvConfigOutput = dotenv.config({
        path: path.resolve(__dirname, `../../${envFile}`),
      });
      if (dotenvConfigOutput.error) {
        this.logger.error(dotenvConfigOutput.error, { context: 'ApplicationConfig.load' });
        throw new Error(`load application config from ${envFile} error`);
      }
      this.config = Object.assign({}, this.defaultConfig, dotenvConfigOutput.parsed);
      this.logger.debug(`load application config from ${envFile} done`, {
        arguments: { config: this.config },
        context: 'ApplicationConfig.load',
      });
      return this.config;
    }
    this.config = Object.assign({}, this.defaultConfig, process.env);
    this.logger.debug(`load application config from runtime done`, {
      arguments: { config: this.config },
      context: 'ApplicationConfig.load',
    });
    return this.config;
  }
}

export { ApplicationConfig, IApplicationConfig, IConfig, ApplicationConfigProvider };
