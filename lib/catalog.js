import {CONTRAST} from './constants.js'
import {transformFunctions} from './transform.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

// The catalog is stored as flat typed arrays for cache locality:
// - variants holds the transformed 4 x 4 blocks back to back, pre-multiplied with CONTRAST
// - sums holds each source block's raw pixel sum, which is shared by all of its
//   variants as they contain the same pixels in a different order
export function generateCatalog(src, width, height) {
  const count = blockCount(width) * blockCount(height)
  const xs = new Int32Array(count)
  const ys = new Int32Array(count)
  const sums = new Int32Array(count)
  const variants = new Uint8Array(count * transformFunctions.length * 16)

  let block = 0
  let offset = 0
  for (let y = 0; y <= height - 8; y += 8) {
    for (let x = 0; x <= width - 8; x += 8) {
      xs[block] = x
      ys[block] = y
      for (const fn of transformFunctions) {
        fn(x, y, src, width, workBlock)
        for (let i = 0; i < 16; i++) {
          variants[offset++] = CONTRAST * workBlock[i] >> 8
        }
      }
      sums[block] = blockSum(workBlock)
      block++
    }
  }

  return {xs, ys, sums, variants, count}
}

function blockCount(dimension) {
  return Math.floor((dimension - 8) / 8) + 1
}

function blockSum(block) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += block[i]
  }
  return sum
}
