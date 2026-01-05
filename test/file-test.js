import {expect} from 'chai'
import fs from 'fs'
import {readFile} from '../lib/file-read.js'
import {writeFile} from '../lib/file-write.js'

const OUTPUT_FILE = 'test/test.fractal'

describe('File operations', () => {
  it('Should be able to load a file that it created, describing an empty image', async () => {
    const input = {
      r: [],
      g: [],
      b: [],
      width: 0,
      height: 0,
    }
    await writeFile(input, OUTPUT_FILE)
    const output = await readFile(OUTPUT_FILE)

    expect(output).to.deep.equal(input)
  })

  it('Should be able to load a file that it created, describing an image with some data', async () => {
    const input = {
      r: [{brightness: 0, transform: 1, x: 72, y: 32}, {brightness: -80, transform: 2, x: 128, y: 512}],
      g: [{brightness: -255, transform: 0, x: 0, y: 832}, {brightness: 255, transform: 4, x: 0, y: 16}],
      b: [{brightness: 120, transform: 5, x: 1600, y: 104}, {brightness: 100, transform: 0, x: 80, y: 1024}],
      width: 1280,
      height: 670,
    }
    await writeFile(input, OUTPUT_FILE)
    const output = await readFile(OUTPUT_FILE)

    expect(output).to.deep.equal(input)
  })

  after(() => fs.promises.unlink(OUTPUT_FILE))
})
