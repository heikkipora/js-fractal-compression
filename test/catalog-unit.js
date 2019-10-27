import {expect} from 'chai'
import {generateCatalog} from '../src/catalog.js'
import {TEST_IMAGE, TEST_IMAGE_HEIGHT, TEST_IMAGE_WIDTH} from './fixture/image.js'
import {transformFunctions} from '../src/transform.js'

describe('Catalog generation', () => {
  it('Should generate all block variants for all possible positions', () => {
    const blocks = generateCatalog(TEST_IMAGE, TEST_IMAGE_HEIGHT, TEST_IMAGE_WIDTH)
    expect(blocks).to.deep.equal([
      {x: 0, y: 0, v: transforms(0, 0)},
      {x: 1, y: 0, v: transforms(1, 0)},
      {x: 2, y: 0, v: transforms(2, 0)},
      {x: 0, y: 1, v: transforms(0, 1)},
      {x: 1, y: 1, v: transforms(1, 1)},
      {x: 2, y: 1, v: transforms(2, 1)},
      {x: 0, y: 2, v: transforms(0, 2)},
      {x: 1, y: 2, v: transforms(1, 2)},
      {x: 2, y: 2, v: transforms(2, 2)}
    ])
  })
})

function transforms(x, y) {
  return transformFunctions.map(fn => fn(x, y, TEST_IMAGE, TEST_IMAGE_WIDTH, new Uint8Array(new ArrayBuffer(16))))
}