import {expect} from 'chai'
import {TEST_IMAGE, TEST_IMAGE_WIDTH} from './fixture/image.js'
import {transformFunctions} from '../lib/transform.js'

describe('Transform functions', () => {
  it('Should flip a block horizontally and scale it down 50% with transform #1', () => {
    expectTransformed(0, [
       31,  21,  11,   1,
       71,  61,  51,  41,
      111, 101,  91,  81,
      151, 141, 131, 121
    ])
  })

  it('Should flip a block vertically and scale it down 50% with transform #1', () => {
    expectTransformed(1, [
      121, 131, 141, 151,
       81,  91, 101, 111,
       41,  51,  61,  71,
        1,  11,  21,  31
    ])
  })

  it('Should only scale a block down 50% with transform #2', () => {
    expectTransformed(2, [
        1,  11,  21,  31,
       41,  51,  61,  71,
       81,  91, 101, 111,
      121, 131, 141, 151
    ])
  })

  it('Should rotate a block 90° and scale it down 50% with transform #3', () => {
    expectTransformed(3, [
      121,  81, 41,  1,
      131,  91, 51, 11,
      141, 101, 61, 21,
      151, 111, 71, 31
    ])
  })

  it('Should rotate a block 180° and scale it down 50% with transform #4', () => {
    expectTransformed(4, [
      151, 141, 131, 121,
      111, 101,  91,  81,
       71,  61,  51,  41,
       31,  21,  11,   1
    ])
  })

  it('Should rotate a block 270° and scale it down 50% with transform #5', () => {
    expectTransformed(5, [
      31, 71, 111, 151,
      21, 61, 101, 141,
      11, 51,  91, 131,
       1, 41,  81, 121
    ])
  })
})

function expectTransformed(index, arr) {
  const workBlock = new Uint8Array(new ArrayBuffer(16))    
  transformFunctions[index](1, 1, TEST_IMAGE, TEST_IMAGE_WIDTH, workBlock)
  expect(Array.from(workBlock)).to.deep.equal(arr)
}