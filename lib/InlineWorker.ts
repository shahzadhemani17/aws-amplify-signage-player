
export default class InlineWorker {

  private readonly worker: Worker;

  constructor(func: any) {

    const WORKER_ENABLED = !!(Worker);

    if (WORKER_ENABLED) {
      const functionBody = func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
      
      this.worker = new Worker(URL.createObjectURL(
        new Blob([ functionBody ], { type: 'text/javascript' })
      ));

      this.worker.onmessage = () => {
       // this.onMessage.next(data);
        console.log("in worker thread")
      };

      this.worker.onerror = () => {
       // this.onError.next(data);
      };

    } else {
      throw new Error('WebWorker is not enabled');
    }
  }

  postMessage(data: any) {
    this.worker.postMessage(data);
  }
  terminate() {
    if (this.worker) {
      this.worker.terminate();
    }
  }
}