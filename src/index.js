import {extractBlock} from './block.js'
import {fileToPixels} from './image.js'
import {findBestMatch} from './matching.js'
import {generateCatalog} from './catalog.js'
import {writeFile} from './file-write.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

const timestamp = Date.now()
encodeImage('./example.jpg')
  .then(processed => writeFile(processed, './example.fractal'))
  .then(() => {
    const minutes = (Date.now() - timestamp) / 1000 / 60
    console.log(`Complete, took ${minutes.toFixed(1)} minutes`)
  })
  .catch(console.error)

async function encodeImage(path) {
  const {r, g, b, width, height} = await fileToPixels(path)
   return {
     r: encodeComponent(r, width, height),
     g: encodeComponent(g, width, height),
     b: encodeComponent(b, width, height),
     width,
     height,
     path
  }
}

function encodeComponent(src, width, height) {
  const blocks = generateCatalog(src, width, height)

  const matches = []
  for (let y = 0; y <= height - 4; y += 4) {
    for (let x = 0; x <= width - 4; x += 4) {
      extractBlock(src, x, y, width, workBlock)
      const match = findBestMatch(workBlock, blocks, 4)
      matches.push(match)
    }
  }

  return matches
}
