import {Worker} from 'node:worker_threads'

export function runWorker(url, workerData, transferList) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(url, {workerData, transferList})
    worker.once('message', resolve)
    worker.once('error', reject)
  })
}
