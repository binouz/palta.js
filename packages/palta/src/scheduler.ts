export class Scheduler {
  private static instance: Scheduler;

  private tasks: Array<() => void> = [];

  private constructor() {}

  static init() {
    if (Scheduler.instance) {
      console.warn("Scheduler already initialized");
    }

    Scheduler.instance = new Scheduler();
  }

  static get() {
    if (!Scheduler.instance) {
      console.warn("Scheduler not initialized");
    }

    return Scheduler.instance;
  }

  enqueueUpdate(task: () => void) {
    this.tasks.push(task);
  }

  processNextUpdate() {
    const task = this.tasks.shift();

    if (task) {
      task();
    }

    requestAnimationFrame(() => {
      this.processNextUpdate();
    })
  }

  start() {
    requestAnimationFrame(() => {
      this.processNextUpdate();
    });
  }
}