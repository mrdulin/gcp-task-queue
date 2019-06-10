import { CreateSubscriptionResponse, CreateTopicResponse, PubSub, Subscription, Topic } from '@google-cloud/pubsub';
import { ILogMethods } from 'dl-toolkits';
import { inject, injectable } from 'inversify';
import { ServiceIdentifierManager } from '../ioc/ServiceIdentifierManager';
import { PubSubProvider } from './pubsub.provider';

interface IPubSubService {
  createTopic(topicName: string): Promise<Topic>;
  createSubscription(topicName: string, subName: string): Promise<Subscription>;
}

@injectable()
class PubSubService implements IPubSubService {
  private pubsub!: PubSub;
  private pubsubProvider: PubSubProvider;
  private logger: ILogMethods;

  constructor(
    @inject(ServiceIdentifierManager.PubSubProvider) pubsubProvider: PubSubProvider,
    @inject(ServiceIdentifierManager.Logger) logger: ILogMethods,
  ) {
    this.pubsubProvider = pubsubProvider;
    this.logger = logger;
  }
  public async getPubSub(): Promise<PubSub> {
    if (this.pubsub) {
      return this.pubsub;
    }
    return this.pubsubProvider();
  }
  public async createTopic(topicName: string): Promise<Topic> {
    this.pubsub = await this.getPubSub();
    let exists: boolean;
    const topic: Topic = this.pubsub.topic(topicName);
    try {
      const existsResponse = await topic.exists();
      exists = existsResponse[0];
      if (exists) {
        this.logger.info(`topic: ${topicName} exists. check passed`);
        return topic;
      }
    } catch (error) {
      this.logger.error(error, { arguments: { topicName } });
      throw new Error('check topic exists error');
    }
    const createTopicResponse: CreateTopicResponse = await this.pubsub.createTopic(topicName);
    this.logger.info(`create topic: ${topicName} done.`);
    return createTopicResponse[0];
  }

  public async createSubscription(topicName: string, subName: string): Promise<Subscription> {
    this.pubsub = await this.getPubSub();
    let exists: boolean;
    const subscription: Subscription = this.pubsub.topic(topicName).subscription(subName);
    try {
      const existsResponse = await subscription.exists();
      exists = existsResponse[0];
      if (exists) {
        this.logger.info(`subscription: ${subName} for topic: ${topicName} exists. check passed`);
        return subscription;
      }
    } catch (error) {
      this.logger.error(error, { arguments: { topicName, subName } });
      throw new Error('check subscription exists error');
    }
    const createSubscriptionResponse: CreateSubscriptionResponse = await this.pubsub.createSubscription(
      topicName,
      subName,
    );
    this.logger.info(`create subscription: ${subName} for topic: ${topicName} done.`);
    return createSubscriptionResponse[0];
  }
}

export { PubSubService, IPubSubService };
