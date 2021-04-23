// worker.js
const { parentPort } = require('worker_threads');

// Listen for message from main thread - triggered on worker.postMessage({data: sharedArray, index: i});
parentPort.once('message', (event) => {
    const sharedArray = event.data;
    const index = event.index;

    const arrValue = Atomics.load(sharedArray, index);
    const fibonaciValue = calculateFibonacci(arrValue);

    //sending back result
    parentPort.postMessage(fibonaciValue);
});

const calculateFibonacci = (num) => {
    var a = 1, b = 0, temp;

    while (num >= 0){
      temp = a;
      a = a + b;
      b = temp;
      num--;
    }

    return b;
}
