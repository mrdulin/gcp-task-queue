import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub';

class PubSubConfig implements ClientConfig {
  public keyFilename = '321';
  public projectId = '123';
}

export { PubSubConfig, ClientConfig as IPubSubConfig };
