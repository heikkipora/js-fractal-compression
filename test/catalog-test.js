import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {generateCatalog} from '../lib/catalog.js'
import {CONTRAST} from '../lib/constants.js'
import {TEST_IMAGE, TEST_IMAGE_HEIGHT, TEST_IMAGE_WIDTH} from './fixture/image.js'
import {transformFunctions} from '../lib/transform.js'

describe('Catalog generation', () => {
  it('Should generate all block variants for positions that are divisible by eight', () => {
    const catalog = generateCatalog(TEST_IMAGE, TEST_IMAGE_WIDTH, TEST_IMAGE_HEIGHT)
    assert.equal(catalog.count, 1)
    assert.deepEqual(Array.from(catalog.xs), [0])
    assert.deepEqual(Array.from(catalog.ys), [0])
    assert.deepEqual(Array.from(catalog.variants), contrastScaledTransforms(0, 0))
    assert.deepEqual(Array.from(catalog.sums), [pixelSum(0, 0)])
  })
})

function contrastScaledTransforms(x, y) {
  return transformFunctions.flatMap(fn => {
    const block = fn(x, y, TEST_IMAGE, TEST_IMAGE_WIDTH, new Uint8Array(new ArrayBuffer(16)))
    return Array.from(block, pixel => CONTRAST * pixel >> 8)
  })
}

function pixelSum(x, y) {
  const block = transformFunctions[0](x, y, TEST_IMAGE, TEST_IMAGE_WIDTH, new Uint8Array(new ArrayBuffer(16)))
  return Array.from(block).reduce((sum, pixel) => sum + pixel, 0)
}
