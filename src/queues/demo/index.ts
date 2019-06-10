import { Subscription, Topic } from '@google-cloud/pubsub';
import { inject, injectable } from 'inversify';
import { ServiceIdentifierManager } from '../../ioc';
import { ILogMethods, IMessage, IPubSubService } from '../../services';
import { ITaskQueue } from '../interfaces';

@injectable()
class DemoTaskQueue implements ITaskQueue {
  /**
   * replace TOPIC and SUB with your task queue
   *
   * @static
   * @type {string}
   * @memberof DemoTaskQueue
   */
  public static readonly TOPIC: string = 'ggaw-task-queue';
  public static readonly SUB: string = DemoTaskQueue.TOPIC;

  private pubsubService: IPubSubService;
  private logger: ILogMethods;
  constructor(
    @inject(ServiceIdentifierManager.IPubSubService) pubsubService: IPubSubService,
    @inject(ServiceIdentifierManager.Logger) logger: ILogMethods,
  ) {
    this.pubsubService = pubsubService;
    this.logger = logger;
  }

  public async start() {
    try {
      const { subscription } = await this.initialize();
      subscription.on('message', this.taskHandler);
      subscription.on('error', this.taskErrorHandler);
      this.logger.info('demo task queue started');
    } catch (error) {
      this.logger.error(error);
      throw new Error('demo task queue started error');
    }
  }

  private async initialize() {
    const topic: Topic = await this.pubsubService.createTopic(DemoTaskQueue.TOPIC);
    const subscription: Subscription = await this.pubsubService.createSubscription(
      DemoTaskQueue.TOPIC,
      DemoTaskQueue.SUB,
    );
    return { topic, subscription };
  }
  private async taskHandler(message: IMessage) {
    this.logger.debug(message);
  }

  private async taskErrorHandler(error: Error) {
    this.logger.error(error);
  }
}

export { DemoTaskQueue };
