import {describe, it, after} from 'node:test'
import assert from 'node:assert/strict'
import {fileToPixels, pixelsToFile} from '../lib/image.js'
import fs from 'fs'

const INPUT_FILE = 'examples/hedgehog.jpg'
const OUTPUT_FILE = 'test/test-output.jpg'

describe('Image loading and saving', () => {
  it('Should load an image split to three channels, and merge those back when saving', async () => {
    const {r, g, b, width, height} = await fileToPixels(INPUT_FILE)
    assert.equal(width, 512)
    assert.equal(height, 683)
    assert.equal(r.length, 512 * 683)
    assert.equal(g.length, 512 * 683)
    assert.equal(b.length, 512 * 683)
    await pixelsToFile(r, g, b, width, height, OUTPUT_FILE)
  })

  after(() => fs.promises.unlink(OUTPUT_FILE))
})
