import { PubSub } from '@google-cloud/pubsub';
import { inject, injectable } from 'inversify';
import { ServiceIdentifierManager } from '../ioc/ServiceIdentifierManager';

interface IPubSubService {
  createTopic(topicName: string): Promise<any>;
}

@injectable()
class PubSubService implements IPubSubService {
  private pubsub: PubSub;
  constructor(@inject(ServiceIdentifierManager.PubSub) pubsub: PubSub) {
    this.pubsub = pubsub;
  }
  public async createTopic(topicName: string) {
    // tslint:disable-next-line:no-console
    console.log(this.pubsub.projectId);
  }
}

export { PubSubService, IPubSubService };
