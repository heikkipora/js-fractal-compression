import chai from 'chai'
import {fileToPixels, pixelsToFile} from '../lib/image.js'
import fs from 'fs'

const {expect} = chai

const INPUT_FILE = 'examples/hedgehog.jpg'
const OUTPUT_FILE = 'test/test-output.jpg'

describe('Image loading and saving', () => {
  it('Should load an image split to three channels, and merge those back when saving', async () => {
    const {r, g, b, width, height} = await fileToPixels(INPUT_FILE)
    expect(width).to.equal(512)
    expect(height).to.equal(683)
    expect(r).to.have.lengthOf(512 * 683)
    expect(g).to.have.lengthOf(512 * 683)
    expect(b).to.have.lengthOf(512 * 683)
    await pixelsToFile(r, g, b, width, height, OUTPUT_FILE)
  })

  after(() => fs.promises.unlink(OUTPUT_FILE))
})
