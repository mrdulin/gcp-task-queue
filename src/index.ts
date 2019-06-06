import { IApplication } from './app';
import { ApplicationContainer } from './ioc/inversify';
import { ServiceIdentifierManager } from './ioc/ServiceIdentifierManager';

const applicationContainer = ApplicationContainer.getInstance();
const application: IApplication = applicationContainer.get(ServiceIdentifierManager.IApplication);

application.start();
