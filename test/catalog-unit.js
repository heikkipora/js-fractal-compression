import {expect} from 'chai'
import {generateBlocks} from '../catalog.js'
import {transformFunctions} from '../transform.js'

const sourceImage = new Uint8Array([
  99,  99,  99,  99,  99,  99,  99,  99,  99, 99,
  99,   0,   1,  10,  11,  20,  21,  30,  31, 99,
  99,   2,   3,  12,  13,  22,  23,  32,  33, 99,
  99,  40,  41,  50,  51,  60,  61,  70,  71, 99,
  99,  42,  43,  52,  53,  62,  63,  72,  73, 99,
  99,  80,  81,  90,  91, 100, 101, 110, 111, 99,
  99,  82,  83,  92,  93, 102, 103, 112, 113, 99,
  99, 120, 121, 130, 131, 140, 141, 150, 151, 99,
  99, 122, 123, 132, 133, 142, 143, 152, 153, 99,
  99,  99,  99,  99,  99,  99,  99,  99,  99, 99,
])

describe('Catalog generation', () => {
  it('Should generate all block variants for all possible positions', () => {
    const blocks = generateBlocks(sourceImage, 10, 10)
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
  return transformFunctions.map(fn => fn(x, y, sourceImage, 10, new Uint8Array(new ArrayBuffer(16))))
}