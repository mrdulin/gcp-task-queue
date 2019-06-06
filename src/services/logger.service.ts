import { createLogger, ILogMethods } from 'dl-toolkits';
import { injectable } from 'inversify';

@injectable()
class Logger {
  constructor() {
    return createLogger();
  }
}

export { Logger, ILogMethods };
