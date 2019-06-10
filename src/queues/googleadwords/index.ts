import { Subscription, Topic } from '@google-cloud/pubsub';
import { inject } from 'inversify';
import { ServiceIdentifierManager } from '../../ioc';
import { ILogMethods, IMessage, PubSubService } from '../../services';
import { ITaskQueue } from '../interface';

class GoogleAdwordsTaskQueue implements ITaskQueue {
  public static readonly TOPIC: string = 'ggaw-task-queue';
  public static readonly SUB: string = GoogleAdwordsTaskQueue.TOPIC;

  private pubsubService: PubSubService;
  private logger: ILogMethods;
  constructor(
    @inject(ServiceIdentifierManager.IPubSubService) pubsubService: PubSubService,
    @inject(ServiceIdentifierManager.Logger) logger: ILogMethods,
  ) {
    this.pubsubService = pubsubService;
    this.logger = logger;
  }

  public async start() {
    const { subscription } = await this.initialize();
    subscription.on('message', this.taskHandler);
    subscription.on('error', this.taskErrorHandler);
  }

  private async initialize() {
    const topic: Topic = await this.pubsubService.createTopic(GoogleAdwordsTaskQueue.TOPIC);
    const subscription: Subscription = await this.pubsubService.createSubscription(
      GoogleAdwordsTaskQueue.TOPIC,
      GoogleAdwordsTaskQueue.SUB,
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

export { GoogleAdwordsTaskQueue };
