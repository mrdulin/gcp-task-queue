import { inject, injectable } from 'inversify';
import { ApplicationConfigProvider, IConfig } from './config/application';
import { ServiceIdentifierManager } from './ioc/ServiceIdentifierManager';
import { ILogMethods, IPubSubService } from './services';

interface IApplication {
  start(): Promise<void>;
}

@injectable()
class Application implements IApplication {
  private pubsubService: IPubSubService;
  private applicationConfigProvider: ApplicationConfigProvider;
  private logger: ILogMethods;
  constructor(
    @inject(ServiceIdentifierManager.IPubSubService) pubsubService: IPubSubService,
    @inject(ServiceIdentifierManager.ApplicationConfigProvider) applicationConfigProvider: ApplicationConfigProvider,
    @inject(ServiceIdentifierManager.Logger) logger: ILogMethods,
  ) {
    this.pubsubService = pubsubService;
    this.applicationConfigProvider = applicationConfigProvider;
    this.logger = logger;
  }
  public async start() {
    const config: IConfig = await this.applicationConfigProvider();
    await this.initialize();
  }

  public async initialize() {
    const TOPIC_SUBSCRIPTION_MAPS = [{ topic: 'ggaw-task-queue', sub: 'ggaw-task-queue' }];
    const tasks = [];
    for (const map of TOPIC_SUBSCRIPTION_MAPS) {
      const task = this.pubsubService
        .createTopic(map.topic)
        .then(() => this.pubsubService.createSubscription(map.topic, map.sub))
        .catch((error) => this.logger.error(error));
      tasks.push(task);
    }
    await Promise.all(tasks);
  }
}

export { Application, IApplication };
