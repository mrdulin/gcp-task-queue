import { PubSub } from '@google-cloud/pubsub';

type PubSubProvider = () => Promise<PubSub>;

export { PubSubProvider };
