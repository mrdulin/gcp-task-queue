import { PubSub } from '@google-cloud/pubsub';
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub';
import { Container, decorate, inject, injectable, interfaces } from 'inversify';
import 'reflect-metadata';
import { Application, IApplication } from '../app';
import { ApplicationConfig, ApplicationConfigProvider, IApplicationConfig, IConfig } from '../config/application';
import { IPubSubConfig, PubSubConfig } from '../config/pubsub';
import { IPubSubService, Logger, PubSubProvider, PubSubService } from '../services';
import { ServiceIdentifierManager } from './ServiceIdentifierManager';

interface IApplicationContainerOptions {
  container: Container;
}

class ApplicationContainer {
  public static getInstance(): ApplicationContainer {
    if (ApplicationContainer.instance) {
      return ApplicationContainer.instance;
    }
    return new ApplicationContainer({ container: new Container() });
  }

  private static instance: ApplicationContainer;
  private container: Container;
  private constructor(options: IApplicationContainerOptions) {
    this.container = options.container;
    this.decorate();
    this.bind();
  }

  public get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
    return this.container.get<T>(serviceIdentifier);
  }

  private decorate() {
    // decorate(injectable(), PubSub);
    // decorate(inject(ServiceIdentifierManager.ApplicationConfigProvider) as ParameterDecorator, PubSub, 0);
  }

  private bind() {
    this.container
      .bind(ServiceIdentifierManager.Logger)
      .to(Logger)
      .inSingletonScope();
    this.container
      .bind<IApplicationConfig>(ServiceIdentifierManager.IApplicationConfig)
      .to(ApplicationConfig)
      .inSingletonScope();
    this.container
      .bind<IPubSubConfig>(ServiceIdentifierManager.IPubSubConfig)
      .to(PubSubConfig)
      .inSingletonScope();
    this.container
      .bind<ApplicationConfigProvider>(ServiceIdentifierManager.ApplicationConfigProvider)
      .toProvider<IConfig>((context: interfaces.Context) => {
        return async () => {
          const applicationConfig: IApplicationConfig = context.container.get<IApplicationConfig>(
            ServiceIdentifierManager.IApplicationConfig,
          );
          const config: IConfig = await applicationConfig.load();
          return config;
        };
      });
    this.container
      .bind<PubSubProvider>(ServiceIdentifierManager.PubSubProvider)
      .toProvider<PubSub>((context: interfaces.Context) => {
        return async () => {
          const pubsubConfig: IPubSubConfig = context.container.get<IPubSubConfig>(
            ServiceIdentifierManager.IPubSubConfig,
          );
          const config: ClientConfig = await pubsubConfig.getConfig();
          return new PubSub(config);
        };
      });

    // this.container.bind<PubSub>(ServiceIdentifierManager.PubSub).to(PubSub);
    this.container
      .bind<IApplication>(ServiceIdentifierManager.IApplication)
      .to(Application)
      .inSingletonScope();
    this.container.bind<IPubSubService>(ServiceIdentifierManager.IPubSubService).to(PubSubService);
  }
}

export { ApplicationContainer };
