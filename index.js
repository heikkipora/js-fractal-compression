import {extractBlock} from './block.js'
import {fileToPixels} from './image.js'
import {findBestMatch} from './matching.js'
import {generateBlocks} from './catalog.js'
import {writeFile} from './file-write.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

const timestamp = Date.now()
processImage('./forest.jpg')
  .then(processed => writeFile(processed, './fores.fractal'))
  .then(() => {
    const minutes = (Date.now() - timestamp) / 1000 / 60
    console.log(`Complete, took ${minutes.toFixed(1)} minutes`)
  })
  .catch(console.error)

async function processImage(path) {
  const {r, g, b, width, height} = await fileToPixels(path)
   return {
     r: processComponent('red', r, width, height),
     g: processComponent('green', g, width, height),
     b: processComponent('blue', b, width, height),
     width,
     height,
     path
  }
}

function processComponent(name, component, width, height) {
  const timestamp = Date.now()
  const blocks = generateBlocks(component, width, height)
  const took = Date.now() - timestamp
  console.log(`${name}: generated ${blocks.length * 6} block variants in ${took.toFixed(0)} ms`)

  const matches = []
  for (let y = 0; y < height; y += 4) {
    const timestamp = Date.now()
    for (let x = 0; x < width; x += 4) {
      extractBlock(component, x, y, width, workBlock)
      const match = findBestMatch(workBlock, blocks, 8)
      matches.push(match)
    }
    const progress = y / height * 100
    const msPerBlock = (Date.now() - timestamp) / (width / 4)
    console.log(`${name}: ${progress.toFixed(1)} %, ${msPerBlock.toFixed(1)} ms per block`)
  }

  return matches
}
