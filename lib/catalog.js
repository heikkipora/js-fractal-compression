import {classifyBlock, CLASS_COUNT} from './classify.js'
import {CONTRAST} from './constants.js'
import {transformFunctions} from './transform.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

// The catalog groups all transformed block variants by their classification, so that
// matching only needs to scan candidates from the target block's own class. Each class
// stores its variants as flat typed arrays: pixels are pre-multiplied with CONTRAST,
// sums hold the raw pixel sum for the brightness calculation, and keys hold the source
// block's row-major position (ascending) for proximity-ordered scanning.
export function generateCatalog(src, width, height) {
  const collected = Array.from({length: CLASS_COUNT}, () => ({xs: [], ys: [], transforms: [], sums: [], keys: [], pixels: []}))

  for (let y = 0; y <= height - 8; y += 8) {
    for (let x = 0; x <= width - 8; x += 8) {
      transformFunctions.forEach((fn, transform) => {
        fn(x, y, src, width, workBlock)
        const blockClass = collected[classifyBlock(workBlock)]
        blockClass.xs.push(x)
        blockClass.ys.push(y)
        blockClass.transforms.push(transform)
        blockClass.sums.push(blockSum(workBlock))
        blockClass.keys.push(y * width + x)
        for (let i = 0; i < 16; i++) {
          blockClass.pixels.push(CONTRAST * workBlock[i] >> 8)
        }
      })
    }
  }

  return {width, classes: collected.map(toTypedArrays)}
}

function toTypedArrays({xs, ys, transforms, sums, keys, pixels}) {
  return {
    count: xs.length,
    xs: Int32Array.from(xs),
    ys: Int32Array.from(ys),
    transforms: Uint8Array.from(transforms),
    sums: Int32Array.from(sums),
    keys: Int32Array.from(keys),
    variants: Uint8Array.from(pixels)
  }
}

function blockSum(block) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += block[i]
  }
  return sum
}
