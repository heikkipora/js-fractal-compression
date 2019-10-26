import fs from 'fs'
import {pixelsToFile} from './image.js'
import {transformFunctions} from './transform.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

const MAGIC_MARKER = 0x46524143 // FRAC in ASCII

const timestamp = Date.now()
readFile('./example-small.jpg.fractal')
  .then(processImage)
  .then(() => {
    const minutes = (Date.now() - timestamp) / 1000 / 60
    console.log(`Complete, took ${minutes.toFixed(1)} minutes`)
  })
  .catch(console.error)

async function processImage({r, g, b, width, height}) {
  const rPixels = processComponent(r, width, height)
  const gPixels = processComponent(g, width, height)
  const bPixels = processComponent(b, width, height)
  await pixelsToFile(rPixels, gPixels, bPixels, width, height, './example-small-output.jpg')
}

async function readFile(path) {
  const buf = await fs.promises.readFile(path)
  let offset = 0
  const {marker, width, height} = header(buf, offset)
  offset += 8
  if (marker !== MAGIC_MARKER) {
    throw new Error('Uknown file type, marker not found')
  }

  const r = component(buf, offset, 0xFF0000)
  offset += r.length * 4 + 8
  const g = component(buf, offset, 0x00FF00)
  offset += g.length * 4 + 8
  const b = component(buf, offset, 0x0000FF)
  offset += b.length * 4 + 8

  return {r, g, b, width, height}
}

function header(buf, offset) {
  const marker = buf.readUInt32LE(offset)
  const width = buf.readUInt16LE(offset + 4)
  const height = buf.readUInt16LE(offset + 6)
  return {marker, width, height}
}

function component(buf, offset, expectedId) {
  const {id, length} = componentHeader(buf, offset)
  if (id !== expectedId) {
    throw new Error('File parsing failed, unkown component header id ' + expectedId)
  }
  const blocks = []
  for (let i = 0; i < length; i++) {
    blocks.push(block(buf, offset + 8 + i * 4))
  }
  return blocks
}

function componentHeader(buf, offset) {
  const id = buf.readUInt32LE(offset)
  const length = buf.readUInt32LE(offset + 4)
  return {id, length}
}

function block(buf, offset) {
  const packed = buf.readUInt32LE(offset)
  const o = packed & 0x60000000 >> 29
  const t = packed & 0x01F00000 >> 24
  const x = packed & 0x00FFF000 >> 12
  const y = packed & 0x00000FFF
  return {t, o, x, y}
}

function processComponent(component, width, height) {
  let to = new Uint8Array(new ArrayBuffer(width * height))
  let from = new Uint8Array(new ArrayBuffer(width * height))
  for (let i = 0; i < width * height; i++) {
    from[i] = 127
  }
  for(let iteration = 0; iteration < 16; iteration++) {
    processIteration(component, to, from, width, height)
    const swap = to
    to = from
    from = swap
  }
  return to
}

function processIteration(component, to, from, width, height) {
  let i = 0
  for (let toY = 0; toY < height; toY += 4) {
    for (let toX = 0; toX < width; toX += 4) {
      const {t, o, x, y} = component[i++]
      transformFunctions[t](x, y, from, width, workBlock)
      if (o === 1) {
        darken(workBlock)
      } else if (o === 2) {
        lighten(workBlock)
      }
      writeToImage(workBlock, to, toX, toY, width)
    }
  }
}

function writeToImage(workBlock, to, xStart, yStart, width) {
  let i = 0
  for (let y = yStart; y < yStart + 4; y++) {
    for (let x = xStart; x < xStart + 4; x++) {
      to[y * width + x] = workBlock[i++]
    }
  }
}

function darken(block) {
  for (let i = 0; i < 16; i++) {
    block[i] = Math.max(block[i] - 16, 0)
  }
}

function lighten(block) {
  for (let i = 0; i < 16; i++) {
    block[i] = Math.min(block[i] + 16, 255)
  }
}