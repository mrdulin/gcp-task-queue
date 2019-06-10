class ServiceIdentifierManager {
  public static readonly Logger = Symbol.for('Logger');
  public static readonly DotEnv = Symbol.for('DotEnv');
  public static readonly IApplicationConfig = Symbol.for('IApplicationConfig');
  public static readonly ApplicationConfigProvider = Symbol.for('ApplicationConfigProvider');
  public static readonly IPubSubConfig = Symbol.for('IPubSubConfig');
  public static readonly PubSubProvider = Symbol.for('PubSubProvider');
  public static readonly IPubSubService = Symbol.for('IPubSubService');
  public static readonly IApplication = Symbol.for('IApplication');
  public static readonly ITaskQueue = Symbol.for('ITaskQueue');
  public static readonly TaskQueueFactory = Symbol.for('TaskQueueFactory');
}

export { ServiceIdentifierManager };
