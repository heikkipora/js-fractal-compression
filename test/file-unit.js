import {expect} from 'chai'
import fs from 'fs'
import {readFile} from '../file-read.js'
import {writeFile} from '../file-write.js'

const OUTPUT_FILE = `${__dirname}/../test.fractal`

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
      r: [{b: 0, c: 192, t: 1, x: 1200, y: 30}, {b: -80, c: 192, t: 2, x: 255, y: 3000}],
      g: [{b: -127, c: 192, t: 0, x: 0, y: 1000}, {b: 127, c: 192, t: 4, x: 7, y: 4000}],
      b: [{b: 120, c: 192, t: 5, x: 120, y: 100}, {b: 100, c: 192, t: 0, x: 2999, y: 0}],
      width: 1280,
      height: 670,
    }
    await writeFile(input, OUTPUT_FILE)
    const output = await readFile(OUTPUT_FILE)

    expect(output).to.deep.equal(input)
  })

  after(() => fs.promises.unlink(OUTPUT_FILE))
})
