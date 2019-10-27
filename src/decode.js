import {pixelsToFile} from './image.js'
import {readFile} from './file-read.js'
import {transformFunctions} from './transform.js'

const workBlock = new Uint8ClampedArray(new ArrayBuffer(16))

const timestamp = Date.now()
readFile('./example.fractal')
  .then(processImage)
  .then(() => {
    const minutes = (Date.now() - timestamp) / 1000 / 60
    console.log(`Complete, took ${minutes.toFixed(1)} minutes`)
  })
  .catch(console.error)

async function processImage({r, g, b, width, height}) {
  const rPixels = processComponent(r, width, height)
  const gPixels = processComponent(g, width, height)
  const bPixels = processComponent(b, width, height)
  await pixelsToFile(rPixels, gPixels, bPixels, width, height, './example-output.jpg')
}

function processComponent(component, width, height) {
  let to = new Uint8Array(new ArrayBuffer(width * height))
  let from = new Uint8Array(new ArrayBuffer(width * height))
  for (let i = 0; i < width * height; i++) {
    from[i] = 0
  }
  for(let iteration = 0; iteration < 8; iteration++) {
    processIteration(component, to, from, width, height)
    const swap = to
    to = from
    from = swap
  }
  return to
}

function processIteration(component, to, from, width, height) {
  let i = 0
  for (let toY = 0; toY < height; toY += 4) {
    for (let toX = 0; toX < width; toX += 4) {
      const {t, b, c, x, y} = component[i++]
      transformFunctions[t](x, y, from, width, workBlock)
      adjust(workBlock, b, c)
      writeToImage(workBlock, to, toX, toY, width)
    }
  }
}

function writeToImage(workBlock, to, xStart, yStart, width) {
  let i = 0
  for (let y = yStart; y < yStart + 4; y++) {
    for (let x = xStart; x < xStart + 4; x++) {
      to[y * width + x] = workBlock[i++]
    }
  }
}

function adjust(block, brightness, contrast) {
  for (let i = 0; i < 16; i++) {
    block[i] = (contrast * block[i] >> 8) + brightness
  }
}