import { ContainerModule, interfaces } from 'inversify';
import { ServiceIdentifierManager } from '../ioc';
import { DemoTaskQueue } from './demo';
import { GoogleAdwordsTaskQueue } from './googleadwords';
import { ITaskQueue } from './interfaces';

class TaskQueueModule {
  public static getContainerModule() {
    const taskQueues: ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
      bind<ITaskQueue>(ServiceIdentifierManager.ITaskQueue)
        .to(GoogleAdwordsTaskQueue)
        .whenTargetNamed('google-adwords-task-queue');
      bind<ITaskQueue>(ServiceIdentifierManager.ITaskQueue)
        .to(DemoTaskQueue)
        .whenTargetNamed('demo-task-queue');

      bind<interfaces.Factory<ITaskQueue>>(ServiceIdentifierManager.TaskQueueFactory).toFactory<ITaskQueue>(
        (context: interfaces.Context) => {
          return (taskQueueName: string) => {
            switch (taskQueueName) {
              case 'google-adwords-task-queue':
              case 'demo-task-queue':
                return context.container.getNamed(ServiceIdentifierManager.ITaskQueue, taskQueueName);
              default:
                throw new Error(`Not found for task queue: ${taskQueueName}`);
            }
          };
        },
      );
    });
    return taskQueues;
  }
}

export { TaskQueueModule };
