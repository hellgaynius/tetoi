export class DeferredBoolean {
  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this.reject = reject;
      this.resolve = resolve;
    })
    .then(() => true)
    .catch(() => false);
  }
};
