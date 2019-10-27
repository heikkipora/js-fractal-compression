import {fileToPixels} from './image.js.js'
import {encodeImage} from './encoder.js.js'

import {writeFile} from './file-write.js.js'

encodeFileToFile('./example.jpg', './example.fractal')
  .then(() => console.log('Completed'))
  .catch(console.error)

async function encodeFileToFile(srcPath, dstPath) {
  const {r, g, b, width, height} = await fileToPixels(srcPath)
  const encoded = encodeImage(r, g, b, width, height)
  await writeFile(encoded, dstPath)
}