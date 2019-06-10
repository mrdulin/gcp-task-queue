import { ITaskQueue } from './interfaces';

type TaskQueueFactory = (taskQueueName: string) => ITaskQueue;

export { TaskQueueFactory };
