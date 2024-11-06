/**
 * Copyright 2024 Aubin REBILLAT
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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