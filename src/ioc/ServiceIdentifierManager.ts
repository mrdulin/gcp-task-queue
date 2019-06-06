class ServiceIdentifierManager {
  public static readonly Logger = Symbol.for('Logger');
  public static readonly DotEnv = Symbol.for('DotEnv');
  public static readonly IApplicationConfig = Symbol.for('IApplicationConfig');
  public static readonly IPubSubConfig = Symbol.for('IPubSubConfig');
  public static readonly PubSub = Symbol.for('PubSub');
  public static readonly IPubSubService = Symbol.for('IPubSubService');
  public static readonly IApplication = Symbol.for('IApplication');
}

export { ServiceIdentifierManager };
