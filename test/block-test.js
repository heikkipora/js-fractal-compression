import chai from 'chai'
import {extractBlock} from '../lib/encoder.js'
import {TEST_IMAGE, TEST_IMAGE_WIDTH} from './fixture/image.js'

const {expect} = chai

describe('Block extraction', () => {
  it('Should produce a linear data block from a larger image', () => {
    const workBlock = new Uint8Array(new ArrayBuffer(16))    
    extractBlock(TEST_IMAGE, 1, 1, TEST_IMAGE_WIDTH, workBlock)
    expect(Array.from(workBlock)).to.deep.equal([
       0,  1, 10, 11,
       2,  3, 12, 13,
      40, 41, 50, 51,
      42, 43, 52, 53
    ])
  })
})
