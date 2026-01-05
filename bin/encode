#!/usr/bin/env node

import {encodeImage} from '../lib/encoder.js'
import {fileToPixels} from '../lib/image.js'
import {writeFile} from '../lib/file-write.js'

const {2: inFile, 3: outFile} = process.argv
if (!inFile || !outFile) {
  console.log('Usage: encode <input-image> <output-file>')
  process.exit(1)
}

encodeFileToFile(inFile, outFile, 4)
  .then(() => console.log('Completed'))
  .catch(console.error)

async function encodeFileToFile(srcPath, dstPath, allowedError) {
  const {r, g, b, width, height} = await fileToPixels(srcPath)
  const encoded = encodeImage(r, g, b, width, height, allowedError)
  await writeFile(encoded, dstPath)
}