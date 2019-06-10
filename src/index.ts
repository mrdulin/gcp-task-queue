import { IApplication } from './app';
import { ApplicationContainer } from './ioc/inversify';
import { ServiceIdentifierManager } from './ioc/ServiceIdentifierManager';
import { ILogMethods } from './services';

const applicationContainer = ApplicationContainer.getInstance();
const application: IApplication = applicationContainer.get(ServiceIdentifierManager.IApplication);
const logger: ILogMethods = applicationContainer.get(ServiceIdentifierManager.Logger);

application
  .start()
  .then(() => {
    logger.info('task queue started');
  })
  .catch((error) => {
    logger.error('task queue started error');
    logger.error(error);
  });
