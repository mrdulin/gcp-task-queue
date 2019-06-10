import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub';
import { inject, injectable } from 'inversify';
import { ServiceIdentifierManager } from '../ioc';
import { ApplicationConfigProvider, IConfig } from './application';

interface IPubSubConfig {
  getConfig(): Promise<ClientConfig>;
}
@injectable()
class PubSubConfig implements IPubSubConfig {
  private config: ClientConfig = {
    keyFilename: '',
    projectId: '',
  };

  private applicationConfigProvider: ApplicationConfigProvider;
  constructor(
    @inject(ServiceIdentifierManager.ApplicationConfigProvider) applicationConfigProvider: ApplicationConfigProvider,
  ) {
    this.applicationConfigProvider = applicationConfigProvider;
  }

  public async getConfig(): Promise<ClientConfig> {
    const applicationConfig: IConfig = await this.applicationConfigProvider();
    this.config.keyFilename = applicationConfig.PUBSUB_ADMIN_CREDENTIAL;
    this.config.projectId = applicationConfig.PROJECT_ID;
    return this.config;
  }
}

export { PubSubConfig, IPubSubConfig };
