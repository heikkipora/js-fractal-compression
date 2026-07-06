import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {classifyBlock} from '../lib/classify.js'
import {generateCatalog} from '../lib/catalog.js'
import {CONTRAST} from '../lib/constants.js'
import {TEST_IMAGE, TEST_IMAGE_HEIGHT, TEST_IMAGE_WIDTH} from './fixture/image.js'
import {transformFunctions} from '../lib/transform.js'

describe('Catalog generation', () => {
  it('Should generate classified block variants for positions that are divisible by eight', () => {
    const catalog = generateCatalog(TEST_IMAGE, TEST_IMAGE_WIDTH, TEST_IMAGE_HEIGHT)
    assert.equal(catalog.width, TEST_IMAGE_WIDTH)

    const entries = catalog.classes.flatMap((blockClass, classIndex) =>
      Array.from({length: blockClass.count}, (_, i) => ({
        classIndex,
        x: blockClass.xs[i],
        y: blockClass.ys[i],
        transform: blockClass.transforms[i],
        sum: blockClass.sums[i],
        key: blockClass.keys[i],
        pixels: Array.from(blockClass.variants.subarray(i * 16, i * 16 + 16))
      }))
    )
    entries.sort((a, b) => a.transform - b.transform)

    assert.deepEqual(entries, transformFunctions.map((fn, transform) => {
      const block = fn(0, 0, TEST_IMAGE, TEST_IMAGE_WIDTH, new Uint8Array(new ArrayBuffer(16)))
      return {
        classIndex: classifyBlock(block),
        x: 0,
        y: 0,
        transform,
        sum: Array.from(block).reduce((sum, pixel) => sum + pixel, 0),
        key: 0,
        pixels: Array.from(block, pixel => CONTRAST * pixel >> 8)
      }
    }))
  })
})
