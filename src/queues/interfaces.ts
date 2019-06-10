interface ITaskQueue {
  start(): Promise<void>;
}

export { ITaskQueue };
