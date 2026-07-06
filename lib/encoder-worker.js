import {encodeComponent} from './encoder.js'
import {parentPort, workerData} from 'node:worker_threads'

const {pixels, width, height, allowedError} = workerData
parentPort.postMessage(encodeComponent(pixels, width, height, allowedError))
