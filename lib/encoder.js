
import {findBestMatch} from './matching.js'
import {generateCatalog} from './catalog.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

export function encodeImage(r, g, b, width, height, allowedError) {
   return {
     r: encodeComponent(r, width, height, allowedError),
     g: encodeComponent(g, width, height, allowedError),
     b: encodeComponent(b, width, height, allowedError),
     width,
     height
  }
}

export function encodeComponent(src, width, height, allowedError) {
  const catalog = generateCatalog(src, width, height)

  const matches = []
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      extractBlock(src, x, y, width, workBlock)
      const match = findBestMatch(workBlock, catalog, allowedError)
      matches.push(match)
    }
  }

  return matches
}

export function extractBlock(src, xStart, yStart, width, dst) {
  let i = 0
  const xEnd = xStart + 4
  const yEnd = yStart + 4
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      dst[i++] = src[y * width + x]
    }
  }
}