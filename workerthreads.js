const assert = require('assert');
const {
    Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads');
if (isMainThread) {
    // This re-loads the current file inside a Worker instance.
    const worker = new Worker(__filename);
    const subChannel = new MessageChannel();

    worker.postMessage({ myPort: subChannel.port1 }, [subChannel.port1]);
    console.log("Lets start making some work on a different thread!");

    subChannel.port2.on('message', (value) => {
        console.log('received:', value);
    });

    console.log("executing something else in the meantime... main thread is not blocked");
    setInterval(() => console.log('hey!'), 1000);
} else {
    const myNumber = 43;
    function fibo(n) {
        if (n < 2)
            return 1;
        else
            return fibo(n - 2) + fibo(n - 1);
    }
    const result = fibo(myNumber);
    parentPort.once('message', (message) => {
        assert(message.myPort instanceof MessagePort);
        message.myPort.postMessage({ number: result, status: 'Done' });
        message.myPort.close();
    });

}
