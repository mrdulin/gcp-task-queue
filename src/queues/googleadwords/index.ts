import { Subscription, Topic } from '@google-cloud/pubsub';
import { inject, injectable } from 'inversify';
import { ServiceIdentifierManager } from '../../ioc';
import { ILogMethods, IMessage, IPubSubService } from '../../services';
import { ITaskQueue } from '../interfaces';

@injectable()
class GoogleAdwordsTaskQueue implements ITaskQueue {
  public static readonly TOPIC: string = 'ggaw-task-queue';
  public static readonly SUB: string = GoogleAdwordsTaskQueue.TOPIC;

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
      this.logger.info('google adwords task queue started');
    } catch (error) {
      this.logger.error(error);
      throw new Error('google adwords task queue started error');
    }
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
    const { data, ...rest } = message;
    const jsonData = JSON.parse(Buffer.from(data).toString());

    const publishTime = new Date(message.publishTime).getTime();
    const republishTimestamp = Date.now() - 5 * 1000;

    if (publishTime < republishTimestamp) {
      this.logger.info(`message acked with ID: ${message.id}`);
      message.ack();
    } else {
      const duration = Math.abs(republishTimestamp - publishTime);
      this.logger.info(
        `push message:${message.id} back to MQ, after ${duration / 1000} seconds, this message will be redelivered`,
      );
      message.nack();
    }
  }

  private async taskErrorHandler(error: Error) {
    this.logger.error(error);
  }
}

export { GoogleAdwordsTaskQueue };
