
import {findBestMatch} from './matching.js'
import {generateCatalog} from './catalog.js'
import {runWorker} from './worker.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))
const workerUrl = new URL('./encoder-worker.js', import.meta.url)

// Encodes the color components in parallel worker threads.
// Note that the pixel buffers are transferred to the workers, not copied.
export async function encodeImage(r, g, b, width, height, allowedError) {
  const [rBlocks, gBlocks, bBlocks] = await Promise.all([r, g, b].map(pixels =>
    runWorker(workerUrl, {pixels, width, height, allowedError}, [pixels.buffer])
  ))
  return {r: rBlocks, g: gBlocks, b: bBlocks, width, height}
}

export function encodeComponent(src, width, height, allowedError) {
  const catalog = generateCatalog(src, width, height)

  const matches = []
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      extractBlock(src, x, y, width, workBlock)
      const match = findBestMatch(workBlock, x, y, catalog, allowedError)
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