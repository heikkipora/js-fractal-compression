import chai from 'chai'
import {generateCatalog} from '../lib/catalog.js'
import {TEST_IMAGE, TEST_IMAGE_HEIGHT, TEST_IMAGE_WIDTH} from './fixture/image.js'
import {transformFunctions} from '../lib/transform.js'

const {expect} = chai

describe('Catalog generation', () => {
  it('Should generate all block variants for positions that are divisible by eight', () => {
    const blocks = generateCatalog(TEST_IMAGE, TEST_IMAGE_HEIGHT, TEST_IMAGE_WIDTH)
    expect(blocks).to.deep.equal([
      {x: 0, y: 0, variants: transforms(0, 0)}

    ])
  })
})

function transforms(x, y) {
  return transformFunctions.map(fn => fn(x, y, TEST_IMAGE, TEST_IMAGE_WIDTH, new Uint8Array(new ArrayBuffer(16))))
}