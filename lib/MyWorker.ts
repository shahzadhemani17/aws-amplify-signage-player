// MyWorker.ts

class MyWorker {
  private worker: Worker;
  private onDataReceived: (data: any) => void;

  constructor(onDataReceived: (data: any) => void) {
    this.worker = new Worker(new URL("./vengo.worker.ts", import.meta.url), {
      type: "module",
    });

    this.worker.onmessage = this.handleMessage;
    this.onDataReceived = onDataReceived;
  }

  private handleMessage = (event: MessageEvent) => {
    const { action, data } = event.data;
    const resolvedData = Promise.all(data);
    console.log(`Received data from worker: ${data}`);
    console.log(`Resolved Received data from worker: ${resolvedData}`);

    // Update your React component state here
    if (action === "fetchData") {
      // Call the callback function with the received data
      resolvedData.then((data) => {
        this.onDataReceived(data);
        this.terminate();
      });
    }
  };

  fetchData(action: string, data: any) {
    console.log(`Sending data to worker: ${data}`);
    this.worker?.postMessage({ action, data });
  }

  terminate() {
    this.worker.terminate();
  }
}

export default MyWorker;
