import {expect} from 'chai'
import {fileToPixels, pixelsToFile} from '../src/image.js'
import fs from 'fs'

const INPUT_FILE = `${__dirname}/../example-small.jpg`
const OUTPUT_FILE = `${__dirname}/../example-small-test.jpg`

describe('Image loading and saving', () => {
  it('Should load an image split to three channels, and merge those back when saving', async () => {
    const {r, g, b, width, height} = await fileToPixels(INPUT_FILE)
    expect(width).to.equal(256)
    expect(height).to.equal(256)
    expect(r).to.have.lengthOf(256 * 256)
    expect(g).to.have.lengthOf(256 * 256)
    expect(b).to.have.lengthOf(256 * 256)
    await pixelsToFile(r, g, b, width, height, OUTPUT_FILE)
  })

  after(() => fs.promises.unlink(OUTPUT_FILE))
})
