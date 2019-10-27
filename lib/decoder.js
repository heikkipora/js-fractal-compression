import {CONTRAST} from './constants.js'
import {transformFunctions} from './transform.js'

const workBlock = new Uint8ClampedArray(new ArrayBuffer(16))

export function decodeImage(r, g, b, width, height, iterations) {
  return {
    r: decodeComponent(r, width, height, iterations),
    g: decodeComponent(g, width, height, iterations),
    b: decodeComponent(b, width, height, iterations)
  }
}

function decodeComponent(blocks, width, height, iterations) {
  let to = new Uint8Array(new ArrayBuffer(width * height))
  let from = new Uint8Array(new ArrayBuffer(width * height))

  for(let iteration = 0; iteration < iterations; iteration++) {
    processIteration(blocks, to, from, width, height)
    const swap = to
    to = from
    from = swap
  }

  return from
}

function processIteration(blocks, to, from, width, height) {
  let i = 0
  for (let toY = 0; toY < height; toY += 4) {
    for (let toX = 0; toX < width; toX += 4) {
      const {transform, brightness, x, y} = blocks[i++]
      transformFunctions[transform](x, y, from, width, workBlock)
      adjust(workBlock, brightness)
      writeToImage(workBlock, to, toX, toY, width)
    }
  }
}

function adjust(block, brightness) {
  for (let i = 0; i < 16; i++) {
    block[i] = (CONTRAST * block[i] >> 8) + brightness
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
