#!/usr/bin/env node --experimental-modules

import {decodeImage} from '../lib/decoder.js'
import {pixelsToFile} from '../lib/image.js'
import {readFile} from '../lib/file-read.js'

const {2: inFile, 3: outFile, 4: iterations} = process.argv
if (!inFile || !outFile) {
  console.log('Usage: decode <input-file> <output-image> [iterations]')
  process.exit(1)
}

decodeFileToFile(inFile, outFile, Number(iterations || 16))
  .then(() => console.log('Completed'))
  .catch(console.error)

async function decodeFileToFile(srcPath, dstPath, iterations) {
  const {r, g, b, width, height} = await readFile(srcPath)
  const decoded = decodeImage(r, g, b, width, height, iterations)
  await pixelsToFile(decoded.r, decoded.g, decoded.b, width, height, dstPath)
}