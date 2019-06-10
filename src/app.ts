import { inject, injectable } from 'inversify';
import { ApplicationConfigProvider, IConfig } from './config/application';
import { ServiceIdentifierManager } from './ioc/ServiceIdentifierManager';
import { TaskQueueFactory } from './queues';
import { ITaskQueue } from './queues/interfaces';
import { ILogMethods } from './services';

interface IApplication {
  start(): Promise<void>;
}

@injectable()
class Application implements IApplication {
  private applicationConfigProvider: ApplicationConfigProvider;
  private logger: ILogMethods;
  private taskQueueFactory: TaskQueueFactory;
  constructor(
    @inject(ServiceIdentifierManager.ApplicationConfigProvider) applicationConfigProvider: ApplicationConfigProvider,
    @inject(ServiceIdentifierManager.Logger) logger: ILogMethods,
    @inject(ServiceIdentifierManager.TaskQueueFactory) taskQueueFactory: TaskQueueFactory,
  ) {
    this.applicationConfigProvider = applicationConfigProvider;
    this.logger = logger;
    this.taskQueueFactory = taskQueueFactory;
  }
  public async start() {
    const config: IConfig = await this.applicationConfigProvider();
    const taskQueue: ITaskQueue = this.taskQueueFactory(config.TASK_QUEUE_NAME);
    await taskQueue.start();
  }
}

export { Application, IApplication };
