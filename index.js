import fs from 'fs'
import {fileToPixels} from './image.js'
import {findBestMatch, generateBlocks} from './matching.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

const MAGIC_MARKER = 0x46524143 // FRAC in ASCII

const timestamp = Date.now()
processImage('./example.jpg')
  .then(writeFile)
  .then(() => {
    const minutes = (Date.now() - timestamp) / 1000 / 60
    console.log(`Complete, took ${minutes.toFixed(1)} minutes`)
  })
  .catch(console.error)

async function processImage(path) {
  const {r, g, b, width, height} = await fileToPixels(path)
   return {
     r: processComponent('red', r, width, height),
     g: processComponent('green', g, width, height),
     b: processComponent('blue', b, width, height),
     width,
     height,
     path
  }
}

async function writeFile({r, g, b, width, height, path}) {
  const out = fs.createWriteStream(`${path}.fractal`)
  out.write(header(width, height))

  out.write(componentHeader(0xFF0000, r.length))
  r.forEach(m => out.write(block(m)))

  out.write(componentHeader(0x00FF00, g.length))
  g.forEach(m => out.write(block(m)))

  out.write(componentHeader(0x0000FF, b.length))
  b.forEach(m => out.write(block(m)))

  out.close()
}

function header(width, height) {
  const buf = Buffer.alloc(8)
  buf.writeUInt32LE(MAGIC_MARKER, 0)
  buf.writeUInt16LE(width, 4)
  buf.writeUInt16LE(height, 6)
  return buf
}

function componentHeader(id, length) {
  const buf = Buffer.alloc(8)
  buf.writeUInt32LE(id, 0)
  buf.writeUInt32LE(length, 4)
  return buf
}

function block({t, x, y}) {
  const buf = Buffer.alloc(4)
  const packed = t << 24 | x << 12 | y
  buf.writeUInt32LE(packed, 0)
  return buf
}

function processComponent(name, component, width, height) {
  const timestamp = Date.now()
  const blocks = generateBlocks(component, width, height)
  const took = Date.now() - timestamp
  console.log(`${name}: generated ${blocks.length * 6} block variants in ${took.toFixed(0)} ms`)

  const matches = []
  for (let y = 0; y < height; y += 4) {
    const timestamp = Date.now()
    for (let x = 0; x < width; x += 4) {
      extractBlock(component, x, y, width, workBlock)
      const match = findBestMatch(workBlock, blocks, 16)
      matches.push(match)
    }
    const progress = y / height * 100
    const msPerBlock = (Date.now() - timestamp) / (width / 4)
    console.log(`${name}: ${progress.toFixed(1)} %, ${msPerBlock.toFixed(1)} ms per block`)
  }

  return matches
}

function extractBlock(src, xStart, yStart, width, dst) {
  let i = 0
  const xEnd = xStart + 4
  const yEnd = yStart + 4
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      dst[i++] = src[y * width + x]
    }
  }
}