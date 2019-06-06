import { inject, injectable } from 'inversify';
import { IApplicationConfig, IConfig } from './config/application';
import { ServiceIdentifierManager } from './ioc/ServiceIdentifierManager';
import { ILogMethods, IPubSubService } from './services';

interface IApplication {
  start(): Promise<void>;
}

@injectable()
class Application implements IApplication {
  private pubsubService: IPubSubService;
  private applicationConfig: IApplicationConfig;
  private logger: ILogMethods;
  constructor(
    @inject(ServiceIdentifierManager.IPubSubService) pubsubService: IPubSubService,
    @inject(ServiceIdentifierManager.IApplicationConfig) applicationConfig: IApplicationConfig,
    @inject(ServiceIdentifierManager.Logger) logger: ILogMethods,
  ) {
    this.pubsubService = pubsubService;
    this.applicationConfig = applicationConfig;
    this.logger = logger;
  }
  public async start() {
    let config: IConfig;
    try {
      config = await this.applicationConfig.load();
      this.logger.debug('load application config done', { context: 'Application.start', arguments: { config } });
    } catch (error) {
      this.logger.error('load application config error');
    }
    this.pubsubService.createTopic('test');
  }
}

export { Application, IApplication };
